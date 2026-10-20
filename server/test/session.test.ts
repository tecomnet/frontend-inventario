import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSession, setSession, type Sesion } from '../session.js';
import { SESSION_SECRET, SESSION_TIMEOUT } from '../config.js';

const COOKIE = 'tec_inv_sess';

const reqCon = (cookies: Record<string, string> = {}) =>
  ({ cookies, headers: {}, secure: false }) as unknown as Request;

/** Llama a setSession y devuelve el valor de la cookie que escribió. */
function cookieDe(sesion: Sesion): string {
  let valor = '';
  const res = {
    cookie: (nombre: string, v: string) => { if (nombre === COOKIE) valor = v; },
  } as unknown as Response;
  setSession(reqCon(), res, sesion);
  return valor;
}

const sesion: Sesion = {
  user: { NombreUsuario: 'ana', Nombre: 'Ana', Rol: 'writer' },
  token: 'token-de-la-api',
};

afterEach(() => { vi.useRealTimers(); });

describe('getSession', () => {
  it('devuelve el usuario y el token con una cookie válida', () => {
    const s = getSession(reqCon({ [COOKIE]: cookieDe(sesion) }));
    expect(s).toEqual(sesion);
  });

  it('no deja el token de la API legible en la cookie', () => {
    const cookie = cookieDe(sesion);
    expect(JSON.stringify(jwt.decode(cookie))).not.toContain('token-de-la-api');
  });

  it('devuelve null sin cookie', () => {
    expect(getSession(reqCon())).toBeNull();
  });

  it('devuelve null si la cookie fue alterada', () => {
    const [header, , firma] = cookieDe(sesion).split('.');
    const payload = Buffer.from(JSON.stringify({ user: { NombreUsuario: 'otro', Rol: 'admin' } }))
      .toString('base64url');
    expect(getSession(reqCon({ [COOKIE]: `${header}.${payload}.${firma}` }))).toBeNull();
  });

  it('devuelve null si la cookie está firmada con otro secreto', () => {
    const ajena = jwt.sign({ user: sesion.user }, 'otro-secreto');
    expect(getSession(reqCon({ [COOKIE]: ajena }))).toBeNull();
  });

  it('devuelve null si la cookie expiró por inactividad', () => {
    vi.useFakeTimers();
    const cookie = cookieDe(sesion);
    vi.advanceTimersByTime((SESSION_TIMEOUT + 1) * 1000);
    expect(getSession(reqCon({ [COOKIE]: cookie }))).toBeNull();
  });

  it('descarta el token si su cifrado fue alterado, aunque la firma sea válida', () => {
    const cookie = jwt.sign({ user: sesion.user, tok: 'basura' }, SESSION_SECRET);
    expect(getSession(reqCon({ [COOKIE]: cookie }))).toEqual({ user: sesion.user, token: null });
  });
});
