// Cliente HTTP del front hacia el BFF (/api/*). El BFF hace de proxy a la
// API de Inventario. Centraliza el manejo de 401 (sesión caída) y 403 (sin
// permiso), que el BFF distingue con "motivo" / "sinPermiso".

/** Prefijo del BFF. Todas las rutas son relativas (mismo origen). */
export const API = '/api';

/** Por qué se cayó la sesión, tal como lo reporta el BFF. */
export type MotivoSesion = 'sin-sesion' | 'token-expirado';

export interface SesionCaida {
  motivo: MotivoSesion;
  mensaje: string;
}

let unauthorizedHandler: ((info: SesionCaida) => void) | null = null;
let forbiddenHandler: ((mensaje: string) => void) | null = null;
// Se avisa de la sesión caída UNA sola vez: una pantalla puede lanzar varias
// peticiones en paralelo y todas devolverían 401. Sin esto, cada una dispararía
// su propia redirección al login (el ciclo que reportó el ticket).
let sesionCaidaAvisada = false;

export function setUnauthorizedHandler(fn: (info: SesionCaida) => void) {
  unauthorizedHandler = fn;
}

export function setForbiddenHandler(fn: (mensaje: string) => void) {
  forbiddenHandler = fn;
}

/** Rearma el aviso de sesión caída (al entrar de nuevo con sesión válida). */
export function resetSesionCaida() {
  sesionCaidaAvisada = false;
}

/** Lee el { error, motivo } del BFF sin consumir el cuerpo para quien llamó. */
async function cuerpoError(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.clone().json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { credentials: 'same-origin', ...init });
  if (url.includes('/auth')) return res; // el login maneja sus propios códigos

  if (res.status === 401) {
    // 401 en una ruta autenticada => sesión caída, ya sea porque no hay sesión
    // de panel (401 del BFF) o porque la API rechazó el token (401 de la API).
    if (!sesionCaidaAvisada && unauthorizedHandler) {
      sesionCaidaAvisada = true;
      const data = await cuerpoError(res);
      const motivo: MotivoSesion = data.motivo === 'token-expirado' ? 'token-expirado' : 'sin-sesion';
      const mensaje = typeof data.error === 'string' && data.error
        ? data.error
        : 'Tu sesión expiró. Vuelve a iniciar sesión.';
      unauthorizedHandler({ motivo, mensaje });
    }
    return res;
  }

  // 403: la sesión sigue viva, lo que falta es permiso. No se cierra nada.
  // El aviso global es solo para las LECTURAS: en una escritura la pantalla ya
  // reporta el fallo por su cuenta y saldrían dos avisos por lo mismo.
  const esLectura = (init?.method ?? 'GET').toUpperCase() === 'GET';
  if (res.status === 403 && esLectura && forbiddenHandler) {
    const data = await cuerpoError(res);
    forbiddenHandler(
      typeof data.error === 'string' && data.error
        ? data.error
        : 'No tienes permiso para realizar esta acción.',
    );
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
  check: async () => {
    const j = await getJSON<{ authenticated: boolean; user: Usuario | null }>(
      `${API}/auth?action=check`,
    );
    if (j.authenticated) resetSesionCaida();
    return j;
  },
  login: async (Username: string, Password: string) => {
    const r = await sendJSONStatus<{ ok: boolean; mensaje?: string }>(
      'POST',
      `${API}/auth?action=login`,
      { Username, Password },
    );
    if (r.ok && r.data.ok) resetSesionCaida();
    return r;
  },
  logout: () => fetch(`${API}/auth?action=logout`, { credentials: 'same-origin' }),
};
