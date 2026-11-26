import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sims from '../pages/Sims';

const notify = vi.fn();
const notifyError = vi.fn();
let puedeEscribir = true;

// El layout trae menú y sesión: aquí solo importa la pantalla.
vi.mock('../components/AppLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../context/UIContext', () => ({ useUI: () => ({ notify, notifyError }) }));
vi.mock('../hooks/usePermisos', () => ({ usePermisos: () => ({ puedeEscribir }) }));

// El listado trae el estado por nombre ("Activado"); el PUT lo pide por número.
const sim = {
  id: 7, imsi: '334140000000007', iccid: '8952140000000000007', msisdn: '5512345678',
  idProducto: 4, productoDescripcion: 'Chip 5G', loteTecomnet: 'LT-1', loteALtan: 'LA-1',
  fechaRegistro: '2026-01-05T00:00:00', estadoSim: 'Activado',
  fechaCompra: null, fechaRecepcion: null, fechaEntrega: null,
  fechaActivacion: '2026-01-10T00:00:00', fechaSuspencion: null, fechaReactivacion: null,
  fechaInicioFacturacion: null, fechaBaja: null, fechaInstalacion: null, fechaVenta: null, ultimaFecha: null,
};

/** Lo que se le pidió a fetch: url, método y cuerpo ya parseado. */
interface Llamada { url: string; method: string; body: unknown }
let llamadas: Llamada[] = [];
/** Respuesta de la API al PUT (por omisión, 200 sin cuerpo). */
let respuestaEscritura: () => Response;

const json = (status: number, data?: unknown) =>
  new Response(data === undefined ? '' : JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

/** fetch simulado: el GET devuelve la SIM paginada; el PUT, respuestaEscritura. */
function simularFetch() {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    llamadas.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (method !== 'GET') return respuestaEscritura();
    return json(200, { data: [sim], totalRecords: 1, page: 1, pageSize: 10, totalPages: 1 });
  }));
}

const ultimoGet = () => llamadas.filter((l) => l.method === 'GET').at(-1)?.url;

function renderSims() {
  render(
    <MemoryRouter>
      <Sims />
    </MemoryRouter>,
  );
}

describe('Sims', () => {
  beforeEach(() => {
    puedeEscribir = true;
    llamadas = [];
    respuestaEscritura = () => json(200);
    notify.mockReset();
    notifyError.mockReset();
    notifyError.mockReturnValue({});
    simularFetch();
  });

  it('lista las sims con el estado en español', async () => {
    renderSims();

    expect(await screen.findByText('8952140000000000007')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Activa' })).toBeInTheDocument();
    expect(screen.getByText('10/01/2026')).toBeInTheDocument();
    expect(ultimoGet()).toBe('/api/Catalogos/simdet?page=1&pageSize=10');
  });

  it('busca con los filtros y los quita con Limpiar filtros', async () => {
    const user = userEvent.setup();
    renderSims();
    await screen.findByText('8952140000000000007');

    await user.type(screen.getByPlaceholderText('Buscar ICCID, IMSI o MSISDN...'), '8952');
    await user.type(screen.getByPlaceholderText('Lote'), 'LT-1');
    // El primer combo es el filtro de estado (el último es el tamaño de página).
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Suspendida');
    await user.click(screen.getByRole('button', { name: /Buscar/ }));

    await waitFor(() => expect(ultimoGet()).toBe('/api/Catalogos/simdet?page=1&pageSize=10&search=8952&lote=LT-1&estadoSim=4'));

    await user.click(screen.getByRole('button', { name: /Limpiar filtros/ }));

    await waitFor(() => expect(ultimoGet()).toBe('/api/Catalogos/simdet?page=1&pageSize=10'));
    expect(screen.getByPlaceholderText('Lote')).toHaveValue('');
  });

  it('cambia el estado con PUT y reenvía las fechas que ya tenía', async () => {
    const user = userEvent.setup();
    renderSims();

    await user.click(await screen.findByTitle('Editar'));
    expect(screen.getByRole('heading', { name: /SIM 7/ })).toBeInTheDocument();
    // El primer combo es el filtro de estado; el segundo, el del formulario.
    await user.selectOptions(screen.getAllByRole('combobox')[1], 'Baja');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('SIM actualizada.', 'success'));
    expect(llamadas.filter((l) => l.method === 'PUT')).toEqual([{
      url: '/api/Catalogos/simdet/7',
      method: 'PUT',
      body: {
        id: 7, estadoSim: 5,
        fechaInstalacion: null, fechaActivacion: '2026-01-10T00:00:00', fechaReactivacion: null,
        fechaSuspencion: null, fechaInicioFacturacion: null, fechaVenta: null,
        ultimaFecha: null, fechaEntrega: null, fechaBaja: null,
      },
    }]);
    expect(screen.queryByRole('heading', { name: /SIM 7/ })).not.toBeInTheDocument();
  });

  it('si la API rechaza el cambio muestra el error y deja el formulario abierto', async () => {
    respuestaEscritura = () => json(500, { title: 'Error interno' });
    const user = userEvent.setup();
    renderSims();

    await user.click(await screen.findByTitle('Editar'));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(notifyError).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, message: 'Error interno' }), 'No se pudo guardar la SIM', expect.anything(),
    ));
    expect(screen.getByRole('heading', { name: /SIM 7/ })).toBeInTheDocument();
  });

  it('con permiso de solo lectura no muestra Editar', async () => {
    puedeEscribir = false;
    renderSims();

    await screen.findByText('8952140000000000007');
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Editar' })).not.toBeInTheDocument();
  });
});