// ============================================================
//  Sesión del USUARIO del panel mediante cookie JWT httpOnly.
//  STATELESS (sirve igual en local y en Lambda/Amplify): guarda el
//  objeto "user" firmado; expira por inactividad (SESSION_TIMEOUT)
//  y se refresca en cada request válido.
// ============================================================
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, SESSION_TIMEOUT } from './config.js';

const COOKIE = 'tec_inv_sess';

export interface Usuario {
  UsuarioID?: number;
  Email?: string;
  Nombre?: string;
  NombreUsuario?: string;
  [k: string]: unknown;
}

function cookieOpts(req: Request) {
  const isHttps =
    req.secure || (req.headers['x-forwarded-proto'] as string)?.split(',')[0] === 'https';
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isHttps,
    path: '/',
    maxAge: SESSION_TIMEOUT * 1000,
  };
}

/** Escribe (o renueva) la cookie de sesión con el usuario. */
export function setSession(req: Request, res: Response, user: Usuario): void {
  const token = jwt.sign({ user }, SESSION_SECRET, { expiresIn: SESSION_TIMEOUT });
  res.cookie(COOKIE, token, cookieOpts(req));
}

/** Devuelve el usuario de la sesión, o null si no hay/expiró. */
export function getSession(req: Request): Usuario | null {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return null;
  try {
    const payload = jwt.verify(raw, SESSION_SECRET) as { user: Usuario };
    return payload.user ?? null;
  } catch {
    return null;
  }
}

/** Borra la cookie de sesión. */
export function clearSession(req: Request, res: Response): void {
  res.clearCookie(COOKIE, { ...cookieOpts(req), maxAge: undefined });
}
