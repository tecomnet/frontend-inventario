// ============================================================
//  Sesión del USUARIO del panel mediante cookie JWT httpOnly.
//  STATELESS (sirve igual en local y en Lambda/Amplify): guarda el
//  objeto "user" y el token de la API firmados; expira por
//  inactividad (SESSION_TIMEOUT) y se refresca en cada request válido.
//
//  El token de la API va CIFRADO (AES-256-GCM) dentro de la cookie:
//  la firma del JWT solo evita que se altere, pero su payload es
//  base64 legible. Así el navegador nunca ve el token en claro, ni por
//  JS (httpOnly) ni inspeccionando la cookie.
// ============================================================
import type { Request, Response } from 'express';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, SESSION_TIMEOUT } from './config.js';

const COOKIE = 'tec_inv_sess';

// Llave de cifrado derivada del secreto de sesión (distinta de la de firma).
const ENC_KEY = createHash('sha256').update(`${SESSION_SECRET}:api-token`).digest();

export interface Usuario {
  UsuarioID?: number;
  Email?: string;
  Nombre?: string;
  NombreUsuario?: string;
  [k: string]: unknown;
}

export interface Sesion {
  user: Usuario;
  /** Token de la API de Inventario. Solo vive del lado del servidor. */
  token: string | null;
}

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', ENC_KEY, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}

function decrypt(enc: string): string | null {
  try {
    const buf = Buffer.from(enc, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', ENC_KEY, buf.subarray(0, 12));
    decipher.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
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

/** Escribe (o renueva) la cookie de sesión con el usuario y el token de la API. */
export function setSession(req: Request, res: Response, sesion: Sesion): void {
  const payload = { user: sesion.user, tok: sesion.token ? encrypt(sesion.token) : undefined };
  const cookie = jwt.sign(payload, SESSION_SECRET, { expiresIn: SESSION_TIMEOUT });
  res.cookie(COOKIE, cookie, cookieOpts(req));
}

/** Devuelve la sesión, o null si no hay/expiró. */
export function getSession(req: Request): Sesion | null {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return null;
  try {
    const payload = jwt.verify(raw, SESSION_SECRET) as { user?: Usuario; tok?: string };
    if (!payload.user) return null;
    return { user: payload.user, token: payload.tok ? decrypt(payload.tok) : null };
  } catch {
    return null;
  }
}

/** Borra la cookie de sesión. */
export function clearSession(req: Request, res: Response): void {
  res.clearCookie(COOKIE, { ...cookieOpts(req), maxAge: undefined });
}
