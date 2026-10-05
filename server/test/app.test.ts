import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import jwt from 'jsonwebtoken';
import { apiProxy } from '../apiClient.js';
import { createApp } from '../app.js';

// La API de Inventario se sustituye: cada prueba decide qué responde.
vi.mock('../apiClient.js', () => ({ apiProxy: vi.fn() }));
const apiMock = vi.mocked(apiProxy);

const respuesta = (code: number, body: unknown = {}) => ({
  code,
  body: typeof body === 'string' ? body : JSON.stringify(body),
  contentType: 'application/json',
});

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApp().listen(0);
  await new Promise<void>((ok) => server.once('listening', () => ok()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>((ok) => { server.close(() => ok()); }));

beforeEach(() => { apiMock.mockReset(); });

const login = (Username: string, Password: string) =>
  fetch(`${base}/api/auth?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Username, Password }),
  });

/** Inicia sesión con un token de la API y devuelve la cookie de sesión. */
async function cookieDeSesion(token: string): Promise<string> {
  apiMock.mockResolvedValueOnce(respuesta(200, { token }));
  const res = await login('ana', 'correcta');
  expect(res.status).toBe(200);
  const cookie = res.headers.getSetCookie().find((c) => c.startsWith('tec_inv_sess='));
  expect(cookie).toBeDefined();
  return cookie!.split(';')[0];
}

describe('proxy /api/*', () => {
  it('responde 401 sin sesión y no llama a la API', async () => {
    const res = await fetch(`${base}/api/Productos`);
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ login: true, motivo: 'sin-sesion' });
    expect(apiMock).not.toHaveBeenCalled();
  });

  it('responde 401 con una cookie alterada', async () => {
    const res = await fetch(`${base}/api/Productos`, {
      headers: { Cookie: 'tec_inv_sess=no.es.valida' },
    });
    expect(res.status).toBe(401);
    expect(apiMock).not.toHaveBeenCalled();
  });

  it('con sesión reenvía la petición con el token de la sesión', async () => {
    const token = jwt.sign({ role: 'writer' }, 'secreto-de-la-api');
    const cookie = await cookieDeSesion(token);
    apiMock.mockResolvedValueOnce(respuesta(200, { data: [] }));

    const res = await fetch(`${base}/api/Productos?page=2`, { headers: { Cookie: cookie } });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: [] });
    expect(apiMock).toHaveBeenLastCalledWith('GET', '/Productos?page=2', null, undefined, token);
  });

  it('cierra la sesión si la API rechaza el token (401)', async () => {
    const cookie = await cookieDeSesion('token-vencido');
    apiMock.mockResolvedValueOnce(respuesta(401));

    const res = await fetch(`${base}/api/Productos`, { headers: { Cookie: cookie } });

    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ motivo: 'token-expirado' });
    expect(res.headers.getSetCookie().join()).toMatch(/tec_inv_sess=;/);
  });

  it('un 403 de la API no cierra la sesión', async () => {
    const cookie = await cookieDeSesion('token-reader');
    apiMock.mockResolvedValueOnce(respuesta(403));

    const res = await fetch(`${base}/api/Productos`, { method: 'DELETE', headers: { Cookie: cookie } });

    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ sinPermiso: true });
    expect(res.headers.getSetCookie().join()).not.toMatch(/tec_inv_sess=;/);
  });
});

describe('login', () => {
  it('con credenciales incorrectas responde 401 y no crea sesión', async () => {
    apiMock.mockResolvedValueOnce(respuesta(401, { mensaje: 'Usuario o contraseña incorrectos.' }));

    const res = await login('ana', 'incorrecta');

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ ok: false, mensaje: 'Usuario o contraseña incorrectos.' });
    expect(res.headers.getSetCookie()).toEqual([]);
    expect(apiMock).toHaveBeenCalledWith(
      'POST', '/Auth/login', expect.any(Buffer), 'application/json',
    );
  });

  it('si la API no devuelve token no crea sesión', async () => {
    apiMock.mockResolvedValueOnce(respuesta(200, {}));

    const res = await login('ana', 'correcta');

    expect(res.status).toBe(502);
    expect(res.headers.getSetCookie()).toEqual([]);
  });

  it('con credenciales correctas guarda el rol del token y no expone el token', async () => {
    const token = jwt.sign({ role: 'admin' }, 'secreto-de-la-api');
    const cookie = await cookieDeSesion(token);

    const res = await fetch(`${base}/api/auth?action=check`, { headers: { Cookie: cookie } });
    const cuerpo = await res.json();

    expect(cuerpo).toEqual({
      authenticated: true,
      user: { NombreUsuario: 'ana', Nombre: 'ana', Rol: 'admin' },
    });
    expect(JSON.stringify(cuerpo)).not.toContain(token);
  });
});
