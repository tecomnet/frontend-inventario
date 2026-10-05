import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  ApiError, type SesionCaida, getJSON, resetSesionCaida, sendJSON, setForbiddenHandler, setUnauthorizedHandler,
} from '../lib/api';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

let onUnauthorized: Mock<(info: SesionCaida) => void>;
let onForbidden: Mock<(mensaje: string) => void>;

beforeEach(() => {
  onUnauthorized = vi.fn();
  onForbidden = vi.fn();
  setUnauthorizedHandler(onUnauthorized);
  setForbiddenHandler(onForbidden);
  resetSesionCaida();
});

const responder = (...respuestas: Response[]) => {
  const fetchMock = vi.fn();
  respuestas.forEach((r) => fetchMock.mockResolvedValueOnce(r));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('apiFetch', () => {
  it('un 401 dispara el handler de sesión caída con el motivo del BFF', async () => {
    responder(json(401, { error: 'Tu sesión expiró.', motivo: 'token-expirado' }));

    await expect(getJSON('/api/Productos')).rejects.toMatchObject({ status: 401 });

    expect(onUnauthorized).toHaveBeenCalledExactlyOnceWith({
      motivo: 'token-expirado',
      mensaje: 'Tu sesión expiró.',
    });
    expect(onForbidden).not.toHaveBeenCalled();
  });

  it('varios 401 seguidos avisan una sola vez', async () => {
    responder(json(401, { motivo: 'sin-sesion' }), json(401, { motivo: 'sin-sesion' }));

    await Promise.allSettled([getJSON('/api/Productos'), getJSON('/api/Marcas')]);

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('un 403 no dispara el handler de sesión caída', async () => {
    responder(json(403, { error: 'Sin permiso para ver productos.', sinPermiso: true }));

    const err = await getJSON('/api/Productos').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(403);
    expect(onUnauthorized).not.toHaveBeenCalled();
    expect(onForbidden).toHaveBeenCalledExactlyOnceWith('Sin permiso para ver productos.');
  });

  it('un 403 en una escritura no muestra el aviso global (lo reporta la pantalla)', async () => {
    responder(json(403, { error: 'Sin permiso.', sinPermiso: true }));

    await expect(sendJSON('DELETE', '/api/Productos/1')).rejects.toMatchObject({ status: 403 });

    expect(onUnauthorized).not.toHaveBeenCalled();
    expect(onForbidden).not.toHaveBeenCalled();
  });

  it('un 401 del login no dispara el handler', async () => {
    responder(json(401, { ok: false, mensaje: 'Usuario o contraseña no válida.' }));

    await expect(getJSON('/api/auth?action=check')).rejects.toBeInstanceOf(ApiError);

    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
