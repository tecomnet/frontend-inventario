import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Movimientos from '../pages/Movimientos';
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

const movimiento = {
  id: 8, empresaId: 1, udnId: 1, tipoTransaccionId: 2, almacenId: 3, transaccion: 'Movimiento', serie: 'AA', folio: 8,
  fecha: '2026-11-21T12:00:00', referencia: 'REF-1', observaciones: 'Traspaso', estadoId: 3, isDeleted: false,
  movimientoDet: [{
    id: 1, movimientoId: 8, productoId: 4, renglon: 1, cantidad: 2, cantidadPiezas: 0,
    costoUnitario: 10, loteAltan: 'LA-1', loteTecomnet: null,
  }],
};

/** Lo que responde cada catálogo (selects y nombres en las tablas). */
const catalogos: Record<string, unknown[]> = {
  '/api/Catalogos/empresas': [{ id: 1, descripcion: 'Tecomnet' }],
  '/api/Catalogos/unidadesnegocio': [{ id: 1, descripcion: 'Norte', empresaId: 1 }],
  '/api/Catalogos/almacenes': [{ id: 3, descripcion: 'Almacén central', empresaId: 1, udnId: 1 }],
  '/api/Catalogos/tipostransaccion': [{ id: 2, descripcion: 'Entrada' }],
  '/api/Productos': [{ id: 4, descripcion: 'Producto A' }],
};

function renderMovimientos() {
  render(
    <MemoryRouter>
      <Movimientos />
    </MemoryRouter>,
  );
}

/** Elige empresa y UDN y pulsa Consultar: sin eso la lista no se muestra. */
async function consultar(user: ReturnType<typeof userEvent.setup>) {
  await screen.findAllByRole('option', { name: 'Tecomnet' });
  const [empresa, udn] = screen.getAllByRole('combobox');
  await user.selectOptions(empresa, 'Tecomnet');
  await screen.findAllByRole('option', { name: 'Norte' });
  await user.selectOptions(udn, 'Norte');
  await user.click(screen.getByRole('button', { name: /Consultar/ }));
}

describe('Movimientos', () => {
  beforeEach(() => {
    // jsdom no implementa scrollTo (la pantalla sube al abrir detalle o formulario).
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
      const data = url === '/api/MovimientosDeAlmacen' ? [movimiento] : catalogos[url] ?? [];
      return { data, totalRecords: data.length, page: 1, pageSize: 10, totalPages: 1 };
    }) as typeof getPaged);
  });

  it('pide empresa y UDN y luego lista los movimientos con nombres', async () => {
    const user = userEvent.setup();
    renderMovimientos();

    expect(screen.getByText('Ingresa los parámetros para consultar.')).toBeInTheDocument();
    await consultar(user);

    expect(await screen.findByText('AA-8')).toBeInTheDocument();
    expect(await screen.findByText('Almacén central')).toBeInTheDocument();
    expect(await screen.findByText('Entrada')).toBeInTheDocument();
    await waitFor(() => expect(getPaged).toHaveBeenLastCalledWith(
      '/api/MovimientosDeAlmacen',
      expect.objectContaining({ filtros: { empresaId: 1, udnId: 1, fechaDesde: '', fechaHasta: '' } }),
    ));
  });

  it('muestra el detalle con sus renglones sin llamar a buscar', async () => {
    const user = userEvent.setup();
    renderMovimientos();
    await consultar(user);

    await user.click(await screen.findByTitle('Ver detalle'));

    expect(await screen.findByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Traspaso')).toBeInTheDocument();
    expect(screen.getByText('LA-1')).toBeInTheDocument();
    expect(getJSON).not.toHaveBeenCalledWith(expect.stringContaining('/buscar'));
  });

  it('registra un movimiento con POST, estado Aplicado y sin renglones vacíos', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderMovimientos();

    await user.click(await screen.findByRole('button', { name: /Nuevo movimiento/ }));
    await screen.findAllByRole('option', { name: 'Tecomnet' });
    await screen.findAllByRole('option', { name: 'Entrada' });
    const [empresa, udn, almacen, tipo, producto] = screen.getAllByRole('combobox');
    await user.selectOptions(empresa, 'Tecomnet');
    await user.selectOptions(udn, 'Norte');
    await user.selectOptions(almacen, 'Almacén central');
    await user.selectOptions(tipo, 'Entrada');
    await screen.findAllByRole('option', { name: 'Producto A' });
    await user.selectOptions(producto, 'Producto A');
    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '2');
    await user.type(screen.getByLabelText('Lote Altan'), 'LA-9');
    await user.click(screen.getByRole('button', { name: /Agregar renglón/ }));
    await user.click(screen.getByRole('button', { name: /Guardar movimiento/ }));

    expect(sendJSON).toHaveBeenCalledWith('POST', '/api/MovimientosDeAlmacen', {
      empresaId: 1,
      udnId: 1,
      tipoTransaccionId: 2,
      almacenId: 3,
      observaciones: null,
      estadoId: 3,
      detalles: [{ productoId: 4, cantidad: 2, cantidadPiezas: 0, costoUnitario: 0, loteAltan: 'LA-9', loteTecomnet: null }],
    });
    expect(notify).toHaveBeenCalledWith('Movimiento registrado.', 'success');
  });

  it('edita la referencia y observaciones con PUT y conserva su estado', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderMovimientos();
    await consultar(user);

    await user.click(await screen.findByTitle('Editar'));
    const referencia = await screen.findByDisplayValue('REF-1');
    await user.clear(referencia);
    await user.type(referencia, 'REF-2');
    await user.click(screen.getByRole('button', { name: /Guardar movimiento/ }));

    expect(sendJSON).toHaveBeenCalledWith('PUT', '/api/MovimientosDeAlmacen/8', {
      id: 8,
      referencia: 'REF-2',
      observaciones: 'Traspaso',
      estadoId: 3,
    });
    expect(notify).toHaveBeenCalledWith('Movimiento actualizado.', 'success');
  });

  it('si el API rechaza el movimiento muestra el error y no sale del formulario', async () => {
    vi.mocked(sendJSON).mockRejectedValue(new Error('falla'));
    const user = userEvent.setup();
    renderMovimientos();

    await user.click(await screen.findByRole('button', { name: /Nuevo movimiento/ }));
    await user.click(screen.getByRole('button', { name: /Guardar movimiento/ }));

    expect(notifyError).toHaveBeenCalledWith(expect.any(Error), 'No se pudo guardar el movimiento', expect.anything());
    expect(screen.getByRole('heading', { name: 'Nuevo movimiento' })).toBeInTheDocument();
  });

  it('con permiso de solo lectura no muestra Nuevo ni Editar', async () => {
    puedeEscribir = false;
    const user = userEvent.setup();
    renderMovimientos();
    await consultar(user);

    await screen.findByText('AA-8');
    expect(screen.queryByRole('button', { name: /Nuevo movimiento/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.getByTitle('Ver detalle')).toBeInTheDocument();
  });
});