import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Compras from '../pages/Compras';
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

const compra = {
  id: 1, empresaId: 1, udnId: 1, transaccion: 'compra', serie: 'AA', folio: 1,
  folioProveedor: 'F-100', uudI_Factura: null, banco: null, referenciaPago: null,
  fechaPago: '2026-11-21T12:00:00', fechaCompra: '2026-11-21T12:00:00', idProveedor: 7,
  referencia: '1 1 compra/AA-1', referenciaRecepcion: null, observaciones: 'Pedido mensual',
  estadoId: 1, isDeleted: false, fechaModificacion: '2026-11-21T12:00:00',
  compraDet: [{
    id: 1, idCompraEnc: 1, idEmpresa: 1, idUdn: 1, transaccion: 'compra', serie: 'AA', folio: 1,
    renglon: 1, productoId: 4, cantidad: 10, cantidadPieza: 0, costoProveedor: 5, costoUnitario: 6, total: 60,
  }],
};

/** Lo que responde cada catálogo (selects y nombres en las tablas). */
const catalogos: Record<string, unknown[]> = {
  '/api/Catalogos/empresas': [{ id: 1, descripcion: 'Tecomnet' }],
  '/api/Catalogos/unidadesnegocio': [{ id: 1, descripcion: 'Norte', empresaId: 1 }],
  '/api/Catalogos/proveedores': [{ id: 7, descripcion: 'Proveedor Uno' }],
  '/api/Productos': [{ id: 4, descripcion: 'Producto A' }],
};

function renderCompras() {
  render(
    <MemoryRouter>
      <Compras />
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

describe('Compras', () => {
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
    vi.mocked(getJSON).mockImplementation((async (url: string) =>
      url.startsWith('/api/Compras/buscar') ? compra : catalogos[url] ?? []) as typeof getJSON);
    vi.mocked(getPaged).mockReset();
    vi.mocked(getPaged).mockImplementation((async (url: string) => {
      const data = url === '/api/Compras' ? [compra] : catalogos[url] ?? [];
      return { data, totalRecords: data.length, page: 1, pageSize: 10, totalPages: 1 };
    }) as typeof getPaged);
  });

  it('pide empresa y UDN y luego lista las compras con nombres', async () => {
    const user = userEvent.setup();
    renderCompras();

    expect(screen.getByText('Elige los parámetros para consultar.')).toBeInTheDocument();
    await consultar(user);

    expect(await screen.findByText('AA-1')).toBeInTheDocument();
    expect(await screen.findByText('Proveedor Uno')).toBeInTheDocument();
    await waitFor(() => expect(getPaged).toHaveBeenLastCalledWith(
      '/api/Compras',
      expect.objectContaining({ filtros: { empresaId: 1, udnId: 1 } }),
    ));
  });

  it('muestra el detalle con sus renglones', async () => {
    const user = userEvent.setup();
    renderCompras();
    await consultar(user);

    await user.click(await screen.findByTitle('Ver detalle'));

    expect(getJSON).toHaveBeenCalledWith('/api/Compras/buscar?id=1');
    expect(await screen.findByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Pedido mensual')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('registra una compra con POST, estado Aplicado y sin renglones vacíos', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderCompras();

    await user.click(await screen.findByRole('button', { name: /Nueva compra/ }));
    await screen.findAllByRole('option', { name: 'Tecomnet' });
    await screen.findAllByRole('option', { name: 'Proveedor Uno' });
    const [empresa, udn, proveedor, producto] = screen.getAllByRole('combobox');
    await user.selectOptions(empresa, 'Tecomnet');
    await user.selectOptions(udn, 'Norte');
    await user.selectOptions(proveedor, 'Proveedor Uno');
    // El primer cuadro de texto del formulario es el folio del proveedor.
    await user.type(screen.getAllByRole('textbox')[0], 'F-200');
    await screen.findAllByRole('option', { name: 'Producto A' });
    await user.selectOptions(producto, 'Producto A');
    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '5');
    await user.clear(screen.getByLabelText('Costo unitario'));
    await user.type(screen.getByLabelText('Costo unitario'), '8');
    await user.click(screen.getByRole('button', { name: /Agregar renglón/ }));
    await user.click(screen.getByRole('button', { name: /Guardar compra/ }));

    expect(sendJSON).toHaveBeenCalledWith('POST', '/api/Compras', {
      empresaId: 1,
      udnId: 1,
      proveedorId: 7,
      folioProveedor: 'F-200',
      uudI_Factura: null,
      banco: null,
      referenciaPago: null,
      fechaCompra: null,
      fechaPago: null,
      observaciones: null,
      estadoId: 3,
      detalles: [{ productoId: 4, cantidad: 5, cantidadPieza: 0, costoProveedor: 0, costoUnitario: 8 }],
    });
    expect(notify).toHaveBeenCalledWith('Compra registrada.', 'success');
  });

  it('edita una compra con PUT y conserva sus renglones', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderCompras();
    await consultar(user);

    await user.click(await screen.findByTitle('Editar'));
    const folio = await screen.findByDisplayValue('F-100');
    await user.clear(folio);
    await user.type(folio, 'F-101');
    await user.click(screen.getByRole('button', { name: /Guardar compra/ }));

    expect(sendJSON).toHaveBeenCalledWith('PUT', '/api/Compras/1', expect.objectContaining({
      id: 1,
      proveedorId: 7,
      folioProveedor: 'F-101',
      fechaCompra: '2026-11-21',
      fechaPago: '2026-11-21',
      estadoId: 1,
      detalles: [{ productoId: 4, cantidad: 10, cantidadPieza: 0, costoProveedor: 5, costoUnitario: 6 }],
    }));
    expect(notify).toHaveBeenCalledWith('Compra actualizada.', 'success');
  });

  it('si el API rechaza la compra muestra el error y no sale del formulario', async () => {
    vi.mocked(sendJSON).mockRejectedValue(new Error('falla'));
    const user = userEvent.setup();
    renderCompras();

    await user.click(await screen.findByRole('button', { name: /Nueva compra/ }));
    await user.click(screen.getByRole('button', { name: /Guardar compra/ }));

    expect(notifyError).toHaveBeenCalledWith(expect.any(Error), 'No se pudo guardar la compra', expect.anything());
    expect(screen.getByRole('heading', { name: 'Nueva compra' })).toBeInTheDocument();
  });

  it('con permiso de solo lectura no muestra Nueva ni Editar', async () => {
    puedeEscribir = false;
    const user = userEvent.setup();
    renderCompras();
    await consultar(user);

    await screen.findByText('AA-1');
    expect(screen.queryByRole('button', { name: /Nueva compra/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.getByTitle('Ver detalle')).toBeInTheDocument();
  });
});
