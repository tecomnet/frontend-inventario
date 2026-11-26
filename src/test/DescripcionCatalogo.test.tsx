import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DescripcionCatalog from '../components/DescripcionCatalog';

const notify = vi.fn();
const notifyError = vi.fn();
let puedeEscribir = true;

vi.mock('../components/AppLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../context/UIContext', () => ({ useUI: () => ({ notify, notifyError }) }));
vi.mock('../hooks/usePermisos', () => ({ usePermisos: () => ({ puedeEscribir }) }));

const marcas = [
  { id: 3, descripcion: 'Altan' },
  { id: 7, descripcion: 'Tecomnet' },
];

interface Llamada { url: string; method: string; body: unknown }
let llamadas: Llamada[] = [];

const json = (status: number, data?: unknown) =>
  new Response(data === undefined ? '' : JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function simularFetch() {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    llamadas.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (method !== 'GET') return json(200);
    return json(200, { data: marcas, totalRecords: 2, page: 1, pageSize: 10, totalPages: 1 });
  }));
}

const ultimoGet = () => llamadas.filter((l) => l.method === 'GET').at(-1)?.url;
const escrituras = () => llamadas.filter((l) => l.method !== 'GET');

function renderMarcas() {
  render(
    <MemoryRouter>
      <DescripcionCatalog active="marcas" titulo="Marcas" singular="Marca" url="/api/Catalogos/marcas" />
    </MemoryRouter>,
  );
}

describe('DescripcionCatalog', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    puedeEscribir = true;
    llamadas = [];
    notify.mockReset();
    notifyError.mockReset();
    simularFetch();
  });

  it('busca con el parámetro search', async () => {
    const user = userEvent.setup();
    renderMarcas();
    await screen.findByText('Altan');

    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'alt');
    await user.click(screen.getByRole('button', { name: /Buscar/ }));

    await waitFor(() => expect(ultimoGet()).toBe('/api/Catalogos/marcas?page=1&pageSize=10&search=alt'));
  });

  it('crea con POST', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await user.click(await screen.findByRole('button', { name: /Nuevo/ }));
    await user.type(screen.getByLabelText('Descripción'), 'Telcel');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Marca creada.', 'success'));
    expect(escrituras()).toEqual([{ url: '/api/Catalogos/marcas', method: 'POST', body: { descripcion: 'Telcel' } }]);
  });

  it('edita con PUT', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await user.click((await screen.findAllByTitle('Editar'))[0]);
    const descripcion = screen.getByLabelText('Descripción');
    await user.clear(descripcion);
    await user.type(descripcion, 'Altan Redes');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Marca actualizada.', 'success'));
    expect(escrituras()).toEqual([{ url: '/api/Catalogos/marcas/3', method: 'PUT', body: { id: 3, descripcion: 'Altan Redes' } }]);
  });

  it('da de baja con DELETE después de confirmar en el modal', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await user.click((await screen.findAllByTitle('Dar de baja'))[0]);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('¿Dar de baja "Altan"?');
    await user.click(within(modal).getByRole('button', { name: 'Dar de baja' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Marca dada de baja.', 'success'));
    expect(escrituras()).toEqual([{ url: '/api/Catalogos/marcas/3', method: 'DELETE', body: undefined }]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('al cancelar no da de baja', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await user.click((await screen.findAllByTitle('Dar de baja'))[0]);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(escrituras()).toEqual([]);
  });

  it('con permiso de solo lectura no muestra Nuevo, Editar ni baja', async () => {
    puedeEscribir = false;
    renderMarcas();

    await screen.findByText('Altan');
    expect(screen.queryByRole('button', { name: /Nuevo/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Dar de baja')).not.toBeInTheDocument();
  });
});