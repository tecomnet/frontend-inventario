import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Paginacion from '../components/Paginacion';

function renderPaginacion(props: Partial<Parameters<typeof Paginacion>[0]> = {}) {
  const onPage = vi.fn();
  const onPageSize = vi.fn();
  render(
    <Paginacion page={1} pageSize={10} totalRecords={95} totalPages={10}
      onPage={onPage} onPageSize={onPageSize} etiqueta="productos" {...props} />,
  );
  return { onPage, onPageSize };
}

/** Números de página visibles (y elipsis), en orden. */
const ventana = () =>
  [...document.querySelectorAll('.page-btn, .pagination-ellipsis')]
    .map((el) => el.textContent?.trim())
    .filter((t) => t && !/Anterior|Siguiente/.test(t));

describe('Paginacion', () => {
  it('muestra el total y la página actual', () => {
    renderPaginacion({ page: 3 });
    expect(screen.getByText(/95 productos · página 3 de 10/)).toBeInTheDocument();
  });

  it('en la primera página deshabilita Anterior', () => {
    renderPaginacion();
    expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeEnabled();
  });

  it('en la última página deshabilita Siguiente', () => {
    renderPaginacion({ page: 10 });
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeDisabled();
  });

  it('muestra una ventana de páginas con elipsis', () => {
    renderPaginacion({ page: 5 });
    expect(ventana()).toEqual(['1', '…', '3', '4', '5', '6', '7', '…', '10']);
  });

  it('con una sola página no muestra números', () => {
    renderPaginacion({ totalRecords: 4, totalPages: 1 });
    expect(ventana()).toEqual([]);
    expect(screen.getByText('4 productos')).toBeInTheDocument();
  });

  it('avisa la página elegida con los botones y los números', async () => {
    const user = userEvent.setup();
    const { onPage } = renderPaginacion({ page: 5 });

    await user.click(screen.getByRole('button', { name: /Siguiente/ }));
    await user.click(screen.getByRole('button', { name: /Anterior/ }));
    await user.click(screen.getByRole('button', { name: '10' }));

    expect(onPage.mock.calls).toEqual([[6], [4], [10]]);
  });

  it('avisa el tamaño de página elegido', async () => {
    const user = userEvent.setup();
    const { onPageSize } = renderPaginacion();

    await user.selectOptions(screen.getByRole('combobox'), '50');

    expect(onPageSize).toHaveBeenCalledWith(50);
  });
});
