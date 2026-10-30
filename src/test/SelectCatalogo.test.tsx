import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectCatalogo } from '../components/SelectCatalogo';
import { getPaged } from '../lib/paged';

vi.mock('../lib/paged', async (original) => ({
  ...(await original<typeof import('../lib/paged')>()),
  getPaged: vi.fn(),
}));

const marcas = [
  { id: 3, descripcion: 'Altan' },
  { id: 7, descripcion: 'Tecomnet' },
];

function responde(data = marcas, totalRecords = data.length) {
  vi.mocked(getPaged).mockResolvedValue({ data, totalRecords, page: 1, pageSize: 100, totalPages: 1 });
}

describe('SelectCatalogo', () => {
  beforeEach(() => { vi.mocked(getPaged).mockReset(); });

  it('muestra las opciones por nombre', async () => {
    responde();
    render(<SelectCatalogo catalogo="marcas" value={0} onChange={vi.fn()} />);

    expect(await screen.findByRole('option', { name: 'Altan' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tecomnet' })).toBeInTheDocument();
  });

  it('al elegir un nombre avisa su id', async () => {
    responde();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SelectCatalogo catalogo="marcas" value={0} onChange={onChange} />);

    await screen.findByRole('option', { name: 'Tecomnet' });
    await user.selectOptions(screen.getByRole('combobox'), 'Tecomnet');

    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('si el catálogo cabe en una página no muestra el buscador', async () => {
    responde();
    render(<SelectCatalogo catalogo="marcas" value={0} onChange={vi.fn()} />);

    await screen.findByRole('option', { name: 'Altan' });
    expect(screen.queryByPlaceholderText('Buscar…')).not.toBeInTheDocument();
  });

  it('si hay más registros, busca con el parámetro search', async () => {
    responde(marcas, 250);
    const user = userEvent.setup();
    render(<SelectCatalogo catalogo="marcas" value={0} onChange={vi.fn()} />);

    await user.type(await screen.findByPlaceholderText('Buscar…'), 'alt');

    await waitFor(() => expect(getPaged).toHaveBeenLastCalledWith(
      '/api/Catalogos/marcas',
      expect.objectContaining({ filtros: { search: 'alt' } }),
    ));
  });

  it('si el API falla muestra un mensaje', async () => {
    vi.mocked(getPaged).mockImplementation(async () => { throw new Error('falla'); });
    render(<SelectCatalogo catalogo="marcas" value={0} onChange={vi.fn()} />);

    expect(await screen.findByText('No se pudo cargar el catálogo.')).toBeInTheDocument();
  });
});
