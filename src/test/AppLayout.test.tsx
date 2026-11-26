import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const logout = vi.fn();
let rol: string | null = 'writer';

// El layout solo lee el usuario y su rol: se simula la sesión.
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { Nombre: 'Usuario Prueba', Rol: rol }, logout }),
}));

function renderLayout(active?: string) {
  render(
    <MemoryRouter>
      <AppLayout active={active}>
        <p>Contenido de la pantalla</p>
      </AppLayout>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    logout.mockReset();
    rol = 'writer';
  });

  it('muestra el contenido, el usuario y su rol', () => {
    renderLayout();

    expect(screen.getByText('Contenido de la pantalla')).toBeInTheDocument();
    expect(screen.getByText('Usuario Prueba')).toBeInTheDocument();
    expect(screen.getByText('Escritura')).toBeInTheDocument();
  });

  it('abre y cierra un grupo del menú con su botón', async () => {
    const user = userEvent.setup();
    renderLayout();

    const grupo = screen.getByRole('button', { name: /Compras/ });
    expect(grupo).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: /Recepciones/ })).not.toBeInTheDocument();

    await user.click(grupo);
    expect(grupo).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Recepciones/ })).toHaveAttribute('href', '/recepciones');

    await user.click(grupo);
    expect(screen.queryByRole('link', { name: /Recepciones/ })).not.toBeInTheDocument();
  });

  it('arranca con el grupo de la pantalla activa abierto y la marca', () => {
    renderLayout('productos');

    expect(screen.getByRole('button', { name: /Productos/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /^Productos$/ })).toHaveClass('active');
  });

  it('con rol de solo lectura oculta los importadores', () => {
    rol = 'reader';
    renderLayout();

    expect(screen.getByText('Solo lectura')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Importadores/ })).not.toBeInTheDocument();
  });

  it('Salir cierra la sesión', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: /Salir/ }));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('el botón del borde oculta y muestra el menú', async () => {
    const user = userEvent.setup();
    renderLayout();
    const layout = document.getElementById('layout');
    const inicial = layout?.classList.contains('collapsed');

    await user.click(screen.getByRole('button', { name: 'Mostrar u ocultar menú' }));

    expect(layout?.classList.contains('collapsed')).toBe(!inicial);
  });
});