import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

const reload = vi.fn();
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ reload }) }));
// El fondo animado usa canvas, que jsdom no implementa.
vi.mock('../components/NodeNetwork', () => ({ default: () => null }));

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Simula el BFF: sin sesión, y el login responde lo que diga la prueba. */
function bff(login: () => Response) {
  const fetchMock = vi.fn(async (url: string) =>
    url.includes('action=check') ? json(200, { authenticated: false, user: null }) : login());
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderLogin(state?: unknown) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <Login />
    </MemoryRouter>,
  );
}

async function ingresar(usuario: string, pass: string) {
  const user = userEvent.setup();
  if (usuario) await user.type(screen.getByLabelText('Usuario'), usuario);
  if (pass) await user.type(screen.getByLabelText('Contraseña'), pass);
  await user.click(screen.getByRole('button', { name: /INGRESAR/ }));
}

beforeEach(() => { reload.mockReset(); });

describe('Login', () => {
  it('muestra el mensaje de error que devuelve el BFF', async () => {
    bff(() => json(401, { ok: false, mensaje: 'Usuario o contraseña incorrectos.' }));
    renderLogin();

    await ingresar('ana', 'incorrecta');

    expect(await screen.findByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it('muestra un mensaje genérico si el BFF no manda uno', async () => {
    bff(() => json(401, { ok: false }));
    renderLogin();

    await ingresar('ana', 'incorrecta');

    expect(await screen.findByText('Usuario o contraseña no válida.')).toBeInTheDocument();
  });

  it('avisa si no se pudo conectar con el servidor', async () => {
    bff(() => { throw new TypeError('Failed to fetch'); });
    renderLogin();

    await ingresar('ana', 'secreta');

    expect(await screen.findByText('No se pudo conectar con el servidor.')).toBeInTheDocument();
  });

  it('pide usuario y contraseña sin llamar al BFF', async () => {
    const fetchMock = bff(() => json(200, { ok: true }));
    renderLogin();

    await ingresar('ana', '');

    expect(screen.getByText('Captura usuario y contraseña.')).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => url.includes('action=login'))).toBe(false);
  });

  it('muestra el aviso con el que se llegó (sesión expirada)', () => {
    bff(() => json(200, { ok: true }));
    renderLogin({ mensaje: 'Tu sesión expiró. Vuelve a iniciar sesión.' });

    expect(screen.getByText('Tu sesión expiró. Vuelve a iniciar sesión.')).toBeInTheDocument();
  });
});
