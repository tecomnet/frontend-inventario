import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Ajustes from '../pages/Ajustes';
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

const ajuste = {
  id: 5, empresaId: 1, udnId: 1, tipoTransaccionId: 2, almacenId: 3, transaccion: 'ajuste', serie: 'AJ', folio: 5,
  fecha: '2026-11-21T12:00:00', referencia: null, observaciones: 'Conteo físico', estadoId: 9, isDeleted: false,
  ajusteDet: [{ id: 1, ajusteId: 5, productoId: 4, renglon: 1, cantidad: 2, cantidadPiezas: 0, costo: 10 }],
};

/** Lo que responde cada catálogo (selects y nombres en las tablas). */
const catalogos: Record<string, unknown[]> = {
  '/api/Catalogos/empresas': [{ id: 1, descripcion: 'Tecomnet' }],
  '/api/Catalogos/unidadesnegocio': [{ id: 1, descripcion: 'Norte', empresaId: 1 }],
  '/api/Catalogos/almacenes': [{ id: 3, descripcion: 'Almacén central', empresaId: 1, udnId: 1 }],
  '/api/Catalogos/tipostransaccion': [{ id: 2, descripcion: 'Ajuste de entrada' }],
  '/api/Productos': [{ id: 4, descripcion: 'Producto A' }],
};

function renderAjustes() {
  render(
    <MemoryRouter>
      <Ajustes />
    </MemoryRouter>,
  );
}

describe('Ajustes', () => {
  beforeEach(() => {
    // jsdom no implementa scrollTo (la pantalla sube al abrir el formulario).
    vi.stubGlobal('scrollTo', vi.fn());
    puedeEscribir = true;
    notify.mockReset();
    notifyError.mockReset();
    // Como el real: devuelve los errores por campo (aquí ninguno).
    notifyError.mockReturnValue({});
    vi.mocked(sendJSON).mockReset();
    vi.mocked(getJSON).mockReset();
    vi.mocked(getJSON).mockImplementation((async (url: string) => catalogos[url] ?? []) as typeof getJSON);
    vi.mocked(getPaged).mockReset();
    vi.mocked(getPaged).mockImplementation((async (url: string) => {
      const data = url === '/api/Ajustes' ? [ajuste] : catalogos[url] ?? [];
      return { data, totalRecords: data.length, page: 1, pageSize: 10, totalPages: 1 };
    }) as typeof getPaged);
  });

  it('lista los ajustes de forma paginada', async () => {
    renderAjustes();

    expect(await screen.findByText('AJ-5')).toBeInTheDocument();
    expect(screen.getByText('Conteo físico')).toBeInTheDocument();
    expect(getPaged).toHaveBeenCalledWith('/api/Ajustes', expect.objectContaining({ page: 1 }));
  });

  it('registra un ajuste con POST, aplicado y sin renglones vacíos', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderAjustes();

    await user.click(await screen.findByRole('button', { name: /Nuevo ajuste/ }));
    await screen.findAllByRole('option', { name: 'Tecomnet' });
    const [empresa, udn, almacen, tipo, producto] = screen.getAllByRole('combobox');
    await user.selectOptions(empresa, 'Tecomnet');
    await user.selectOptions(udn, 'Norte');
    await user.selectOptions(almacen, 'Almacén central');
    await user.selectOptions(tipo, 'Ajuste de entrada');
    await user.type(screen.getByRole('textbox'), 'Conteo físico');
    await screen.findAllByRole('option', { name: 'Producto A' });
    await user.selectOptions(producto, 'Producto A');
    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '2');
    await user.click(screen.getByRole('button', { name: /Agregar renglón/ }));
    await user.click(screen.getByRole('button', { name: /Guardar ajuste/ }));

    expect(sendJSON).toHaveBeenCalledWith('POST', '/api/Ajustes', {
      empresaId: 1,
      udnId: 1,
      tipoTransaccionId: 2,
      almacenId: 3,
      observaciones: 'Conteo físico',
      estadoId: 9,
      detalles: [{ productoId: 4, cantidad: 2, cantidadPiezas: 0, costo: 0 }],
    });
    expect(notify).toHaveBeenCalledWith('Ajuste registrado.', 'success');
  });

  it('si el API rechaza el ajuste muestra el error y no sale del formulario', async () => {
    vi.mocked(sendJSON).mockRejectedValue(new Error('falla'));
    const user = userEvent.setup();
    renderAjustes();

    await user.click(await screen.findByRole('button', { name: /Nuevo ajuste/ }));
    await user.click(screen.getByRole('button', { name: /Guardar ajuste/ }));

    expect(notifyError).toHaveBeenCalledWith(expect.any(Error), 'No se pudo registrar el ajuste', expect.anything());
    expect(screen.getByRole('heading', { name: 'Nuevo ajuste' })).toBeInTheDocument();
  });

  it('con permiso de solo lectura no muestra Nuevo ajuste', async () => {
    puedeEscribir = false;
    renderAjustes();

    await screen.findByText('AJ-5');
    expect(screen.queryByRole('button', { name: /Nuevo ajuste/ })).not.toBeInTheDocument();
  });
});
