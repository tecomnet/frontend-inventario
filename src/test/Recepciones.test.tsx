import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Recepciones from '../pages/Recepciones';
import { getJSON, sendJSON } from '../lib/api';
import { getPaged } from '../lib/paged';

const notify = vi.fn();
const notifyError = vi.fn();
let puedeEscribir = true;

// El layout trae menú y sesión: aquí solo importa la pantalla.
vi.mock('../components/AppLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../context/UIContext', () => ({ useUI: () => ({ notify, notifyError }) }));
vi.mock('../hooks/usePermisos', () => ({ usePermisos: () => ({ puedeEscribir }) }));
vi.mock('../lib/api', async (original) => ({
  ...(await original<typeof import('../lib/api')>()),
  getJSON: vi.fn(),
  sendJSON: vi.fn(),
}));
vi.mock('../lib/paged', async (original) => ({
  ...(await original<typeof import('../lib/paged')>()),
  getPaged: vi.fn(),
}));

const recepcion = {
  id: 10, empresaId: 1, udnId: 1, transaccion: 'recepcion', serie: 'AA', folio: 10,
  fechaRecepcion: '2026-11-21T12:00:00', referencia: null, referenciaCompra: '1 1 compra/AA-1',
  estadoId: 1, isDeleted: false, fechaModificacion: '2026-11-21T12:00:00',
  recepcionDet: [{
    id: 1, idRecepcionEnc: 10, empresaId: 1, udnId: 1, transaccion: 'recepcion', serie: 'AA', folio: 10,
    renglon: 1, productoId: 4, cantidad: 20, cantidadPieza: 0,
  }],
};

/** Lo que responde cada catálogo (selects y nombres en las tablas). */
const catalogos: Record<string, unknown[]> = {
  '/api/Catalogos/empresas': [{ id: 1, descripcion: 'Tecomnet' }],
  '/api/Catalogos/unidadesnegocio': [{ id: 1, descripcion: 'Norte', empresaId: 1 }],
  '/api/Productos': [{ id: 4, descripcion: 'Producto A' }],
  '/api/Catalogos/almacenes': [],
};

function renderRecepciones() {
  render(
    <MemoryRouter>
      <Recepciones />
    </MemoryRouter>,
  );
}

describe('Recepciones', () => {
  beforeEach(() => {
    // jsdom no implementa scrollTo (la pantalla sube al abrir detalle o formulario).
    vi.stubGlobal('scrollTo', vi.fn());
    puedeEscribir = true;
    notify.mockReset();
    notifyError.mockReset();
    vi.mocked(sendJSON).mockReset();
    vi.mocked(getJSON).mockReset();
    vi.mocked(getJSON).mockImplementation((async (url: string) =>
      url.startsWith('/api/Recepciones/buscar') ? recepcion : catalogos[url] ?? []) as typeof getJSON);
    vi.mocked(getPaged).mockReset();
    vi.mocked(getPaged).mockImplementation((async (url: string) => {
      const data = url === '/api/Recepciones' ? [recepcion] : catalogos[url] ?? [];
      return { data, totalRecords: data.length, page: 1, pageSize: 10, totalPages: 1 };
    }) as typeof getPaged);
  });

  it('lista las recepciones y filtra por empresa', async () => {
    const user = userEvent.setup();
    renderRecepciones();

    expect(await screen.findByText('AA-10')).toBeInTheDocument();
    await screen.findAllByRole('option', { name: 'Tecomnet' });
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Tecomnet');
    await user.click(screen.getByRole('button', { name: /Filtrar/ }));

    await waitFor(() => expect(getPaged).toHaveBeenLastCalledWith(
      '/api/Recepciones',
      expect.objectContaining({ filtros: { empresaId: 1, udnId: null } }),
    ));
  });

  it('muestra el detalle con sus renglones', async () => {
    const user = userEvent.setup();
    renderRecepciones();

    await user.click(await screen.findByTitle('Ver detalle'));

    expect(getJSON).toHaveBeenCalledWith('/api/Recepciones/buscar?id=10');
    expect(await screen.findByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Transacción')).toBeInTheDocument();
  });

  it('registra una recepción con POST sin mandar renglones vacíos', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderRecepciones();

    await user.click(await screen.findByRole('button', { name: /Nueva recepción/ }));
    await screen.findAllByRole('option', { name: 'Tecomnet' });
    const [empresa, udn, producto] = screen.getAllByRole('combobox');
    await user.selectOptions(empresa, 'Tecomnet');
    await user.selectOptions(udn, 'Norte');
    await user.type(screen.getByRole('textbox'), '1 1 compra/AA-1');
    await screen.findAllByRole('option', { name: 'Producto A' });
    await user.selectOptions(producto, 'Producto A');
    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '5');
    await user.click(screen.getByRole('button', { name: /Agregar renglón/ }));
    await user.click(screen.getByRole('button', { name: /Guardar recepción/ }));

    expect(sendJSON).toHaveBeenCalledWith('POST', '/api/Recepciones', {
      empresaId: 1,
      udnId: 1,
      fechaRecepcion: null,
      referenciaCompra: '1 1 compra/AA-1',
      detalles: [{ productoId: 4, cantidad: 5, cantidadPieza: 0 }],
    });
    expect(notify).toHaveBeenCalledWith('Recepción registrada.', 'success');
  });

  it('edita una recepción con PUT y conserva sus renglones', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderRecepciones();

    await user.click(await screen.findByTitle('Editar'));
    const referencia = await screen.findByDisplayValue('1 1 compra/AA-1');
    await user.clear(referencia);
    await user.type(referencia, '1 1 compra/AA-2');
    await user.click(screen.getByRole('button', { name: /Guardar recepción/ }));

    expect(sendJSON).toHaveBeenCalledWith('PUT', '/api/Recepciones/10', expect.objectContaining({
      id: 10,
      referenciaCompra: '1 1 compra/AA-2',
      estadoId: 1,
      detalles: [{ productoId: 4, cantidad: 20, cantidadPieza: 0 }],
    }));
    expect(notify).toHaveBeenCalledWith('Recepción actualizada.', 'success');
  });

  it('con permiso de solo lectura no muestra Nueva ni Editar', async () => {
    puedeEscribir = false;
    renderRecepciones();

    await screen.findByText('AA-10');
    expect(screen.queryByRole('button', { name: /Nueva recepción/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.getByTitle('Ver detalle')).toBeInTheDocument();
  });
});
