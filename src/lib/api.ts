// Cliente HTTP del front hacia el BFF (/api/*). El BFF hace de proxy a la
// API de Inventario. Centraliza el manejo de 401 (sesión expirada).

/** Prefijo del BFF. Todas las rutas son relativas (mismo origen). */
export const API = '/api';

let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { credentials: 'same-origin', ...init });
  if (res.status === 401 && !url.includes('/auth') && unauthorizedHandler) {
    // 401 en una ruta autenticada (no en /api/auth) => sesión caída.
    unauthorizedHandler();
  }
  return res;
}

export async function getJSON<T = unknown>(url: string): Promise<T> {
  const r = await apiFetch(url);
  return r.json() as Promise<T>;
}

export async function sendJSON<T = unknown>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  body?: unknown,
): Promise<T> {
  const r = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return r.json() as Promise<T>;
}

/** Igual que sendJSON pero devuelve { ok, status, data } para inspeccionar el status. */
export async function sendJSONStatus<T = unknown>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  body?: unknown,
): Promise<{ ok: boolean; status: number; data: T }> {
  const r = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = (await r.json().catch(() => ({}))) as T;
  return { ok: r.ok, status: r.status, data };
}

/** Envía un FormData (multipart) — para los importadores. Devuelve { ok, status, data }. */
export async function sendForm<T = unknown>(
  url: string,
  form: FormData,
): Promise<{ ok: boolean; status: number; data: T }> {
  const r = await apiFetch(url, { method: 'POST', body: form });
  const text = await r.text();
  let data: T;
  try {
    data = (text ? JSON.parse(text) : {}) as T;
  } catch {
    data = text as unknown as T;
  }
  return { ok: r.ok, status: r.status, data };
}

// ---- Atajos de autenticación ----
export interface Usuario {
  UsuarioID?: number;
  Email?: string;
  Nombre?: string;
  NombreUsuario?: string;
  [k: string]: unknown;
}

export const Auth = {
  check: () =>
    getJSON<{ authenticated: boolean; user: Usuario | null }>(`${API}/auth?action=check`),
  login: (Email: string, Password: string) =>
    sendJSONStatus<{ ok: boolean; mensaje?: string }>(
      'POST',
      `${API}/auth?action=login`,
      { Email, Password },
    ),
  logout: () => fetch(`${API}/auth?action=logout`, { credentials: 'same-origin' }),
};
