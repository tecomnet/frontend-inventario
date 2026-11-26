import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from '../components/RequireAuth';

let sesion: { user: unknown; ready: boolean } = { user: null, ready: false };

vi.mock('../context/AuthContext', () => ({ useAuth: () => sesion }));

function renderRuta() {
  render(
    <MemoryRouter initialEntries={['/productos']}>
      <Routes>
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/productos" element={<RequireAuth><p>Pantalla protegida</p></RequireAuth>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('mientras verifica la sesión muestra el indicador de carga', () => {
    sesion = { user: null, ready: false };
    renderRuta();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla protegida')).not.toBeInTheDocument();
  });

  it('sin usuario manda a /login', () => {
    sesion = { user: null, ready: true };
    renderRuta();

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('con usuario muestra la pantalla', () => {
    sesion = { user: { Nombre: 'Usuario Prueba' }, ready: true };
    renderRuta();

    expect(screen.getByText('Pantalla protegida')).toBeInTheDocument();
  });
});