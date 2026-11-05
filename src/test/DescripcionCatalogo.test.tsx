import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DescripcionCatalog from '../components/DescripcionCatalog';
import { sendJSON } from '../lib/api';
import { getPaged } from '../lib/paged';

const notify = vi.fn();
const notifyError = vi.fn();
let puedeEscribir = true;

// El layout trae menú y sesión: aquí solo importa la tabla.
vi.mock('../components/AppLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../context/UIContext', () => ({ useUI: () => ({ notify, notifyError }) }));
vi.mock('../hooks/usePermisos', () => ({ usePermisos: () => ({ puedeEscribir }) }));
vi.mock('../lib/api', async (original) => ({
  ...(await original<typeof import('../lib/api')>()),
  sendJSON: vi.fn(),
}));
vi.mock('../lib/paged', async (original) => ({
  ...(await original<typeof import('../lib/paged')>()),
  getPaged: vi.fn(),
}));

const marcas = [
  { id: 3, descripcion: 'Altan' },
  { id: 7, descripcion: 'Tecomnet' },
];

function renderMarcas() {
  render(
    <MemoryRouter>
      <DescripcionCatalog active="marcas" titulo="Marcas" singular="Marca" url="/api/Catalogos/marcas" />
    </MemoryRouter>,
  );
}

describe('DescripcionCatalog', () => {
  beforeEach(() => {
    puedeEscribir = true;
    notify.mockReset();
    notifyError.mockReset();
    vi.mocked(sendJSON).mockReset();
    vi.mocked(getPaged).mockReset();
    vi.mocked(getPaged).mockResolvedValue({ data: marcas, totalRecords: 2, page: 1, pageSize: 25, totalPages: 1 });
  });

  it('busca con el parámetro search', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'alt');
    await user.click(screen.getByRole('button', { name: /Buscar/ }));

    await waitFor(() => expect(getPaged).toHaveBeenLastCalledWith(
      '/api/Catalogos/marcas',
      expect.objectContaining({ filtros: { search: 'alt' } }),
    ));
  });

  it('da de baja con DELETE después de confirmar en el modal', async () => {
    vi.mocked(sendJSON).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderMarcas();

    await screen.findByText('Altan');
    await user.click(screen.getAllByTitle('Dar de baja')[0]);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('¿Dar de baja "Altan"?');
    await user.click(within(modal).getByRole('button', { name: 'Dar de baja' }));

    expect(sendJSON).toHaveBeenCalledWith('DELETE', '/api/Catalogos/marcas/3');
    expect(notify).toHaveBeenCalledWith('Marca dada de baja.', 'success');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('al cancelar no da de baja', async () => {
    const user = userEvent.setup();
    renderMarcas();

    await screen.findByText('Altan');
    await user.click(screen.getAllByTitle('Dar de baja')[0]);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(sendJSON).not.toHaveBeenCalled();
  });

  it('con permiso de solo lectura no muestra el botón de baja', async () => {
    puedeEscribir = false;
    renderMarcas();

    await screen.findByText('Altan');
    expect(screen.queryByTitle('Dar de baja')).not.toBeInTheDocument();
  });
});
