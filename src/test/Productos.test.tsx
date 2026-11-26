import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos';
import type { ApiError } from '../lib/api';

const notify = vi.fn();
const notifyError = vi.fn();
let puedeEscribir = true;

// El layout trae menú y sesión: aquí solo importa la pantalla.
vi.mock('../components/AppLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../context/UIContext', () => ({ useUI: () => ({ notify, notifyError }) }));
vi.mock('../hooks/usePermisos', () => ({ usePermisos: () => ({ puedeEscribir }) }));

const producto = {
  id: 5, codInterno: 'P-5', descripcion: 'Chip 5G', marcaId: 2, lineaId: 3, presentacioniD: 4,
  unidadMedidaId: 1, materialId: 9, iva: 16, ieps: 0, esActivo: true,
  materialDescripcion: 'Plástico', presentacionDescripcion: 'Pieza', lineaDescripcion: 'Telefonía',
};

/** Lo que se le pidió a fetch: url, método y cuerpo ya parseado. */
interface Llamada { url: string; method: string; body: unknown }
let llamadas: Llamada[] = [];
/** Respuesta de la API a un POST, PUT o DELETE (por omisión, 200 sin cuerpo). */
let respuestaEscritura: () => Response;

const json = (status: number, data?: unknown) =>
  new Response(data === undefined ? '' : JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

/** fetch simulado: los GET devuelven un listado paginado; las escrituras, respuestaEscritura. */
function simularFetch() {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    llamadas.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (method !== 'GET') return respuestaEscritura();
    const data = url.startsWith('/api/Productos?') ? [producto] : [];
    return json(200, { data, totalRecords: data.length, page: 1, pageSize: 10 });
  }));
}

const escrituras = () => llamadas.filter((l) => l.method !== 'GET');

function renderProductos() {
  render(
    <MemoryRouter>
      <Productos />
    </MemoryRouter>,
  );
}

describe('Productos', () => {
  beforeEach(() => {
    // jsdom no implementa scrollTo (la pantalla sube al abrir el formulario).
    vi.stubGlobal('scrollTo', vi.fn());
    puedeEscribir = true;
    llamadas = [];
    respuestaEscritura = () => json(200);
    notify.mockReset();
    notifyError.mockReset();
    // Como el real: devuelve los errores por campo que trae el ApiError.
    notifyError.mockImplementation((err: ApiError) => err.errores ?? {});
    simularFetch();
  });

  it('lista los productos que manda la API', async () => {
    renderProductos();

    expect(await screen.findByText('Chip 5G')).toBeInTheDocument();
    expect(screen.getByText('Telefonía')).toBeInTheDocument();
    expect(llamadas[0]).toMatchObject({ url: '/api/Productos?page=1&pageSize=10', method: 'GET' });
  });

  it('crea un producto con POST y manda null en los catálogos sin elegir', async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.click(await screen.findByRole('button', { name: /Nuevo producto/ }));
    const [codigo, descripcion] = screen.getAllByRole('textbox');
    await user.type(codigo, 'P-9');
    await user.type(descripcion, 'Chip nuevo');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Producto creado.', 'success'));
    expect(escrituras()).toEqual([{
      url: '/api/Productos',
      method: 'POST',
      body: {
        codInterno: 'P-9', descripcion: 'Chip nuevo',
        marcaId: null, lineaId: null, presentacionId: null, unidadMedidaId: null, materialId: null,
        iva: 0, ieps: 0, esActivo: true,
      },
    }]);
  });

  it('edita un producto con PUT y conserva sus catálogos', async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.click(await screen.findByTitle('Editar'));
    const descripcion = screen.getByDisplayValue('Chip 5G');
    await user.clear(descripcion);
    await user.type(descripcion, 'Chip 5G Plus');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Producto actualizado.', 'success'));
    expect(escrituras()).toEqual([{
      url: '/api/Productos/5',
      method: 'PUT',
      body: {
        id: 5, codInterno: 'P-5', descripcion: 'Chip 5G Plus',
        marcaId: 2, lineaId: 3, presentacionId: 4, unidadMedidaId: 1, materialId: 9,
        iva: 16, ieps: 0, esActivo: true,
      },
    }]);
  });

  it('da de baja con DELETE después de confirmar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    renderProductos();

    await user.click(await screen.findByTitle('Dar de baja'));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Producto dado de baja.', 'success'));
    expect(escrituras()).toEqual([{ url: '/api/Productos/5', method: 'DELETE', body: undefined }]);
  });

  it('si la API rechaza un campo muestra su mensaje junto a él', async () => {
    respuestaEscritura = () => json(400, {
      title: 'One or more validation errors occurred.',
      errors: { Descripcion: ["The field Descripcion must be a string with a maximum length of '50'."] },
    });
    const user = userEvent.setup();
    renderProductos();

    await user.click(await screen.findByRole('button', { name: /Nuevo producto/ }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Máximo 50 caracteres.')).toBeInTheDocument();
    expect(notifyError).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }), 'No se pudo guardar el producto', expect.anything());
    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument();
  });

  it('con permiso de solo lectura no muestra Nuevo, Editar ni baja', async () => {
    puedeEscribir = false;
    renderProductos();

    await screen.findByText('Chip 5G');
    expect(screen.queryByRole('button', { name: /Nuevo producto/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Dar de baja')).not.toBeInTheDocument();
  });
});