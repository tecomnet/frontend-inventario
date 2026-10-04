// Cliente HTTP del front hacia el BFF (/api/*). El BFF hace de proxy a la
// API de Inventario. Centraliza el manejo de 401 (sesión caída) y 403 (sin
// permiso), que el BFF distingue con "motivo" / "sinPermiso", y convierte
// cualquier respuesta de error en un ApiError (ver lib/errores para mostrarlo).

/** Prefijo del BFF. Todas las rutas son relativas (mismo origen). */
export const API = '/api';

/** Por qué se cayó la sesión, tal como lo reporta el BFF. */
export type MotivoSesion = 'sin-sesion' | 'token-expirado';

export interface SesionCaida {
  motivo: MotivoSesion;
  mensaje: string;
}

/** Aviso por omisión cuando la API responde 403. */
export const MSG_SIN_PERMISO = 'No tienes permiso para realizar esta acción.';

/**
 * Error de una petición a la API: la respuesta no fue 2xx, o no hubo respuesta.
 * getJSON, sendJSON y sendForm lo lanzan en lugar de devolver el cuerpo del
 * error como si fueran datos.
 */
export class ApiError extends Error {
  /** Status HTTP. 0 = la petición no llegó (sin red o el BFF no responde). */
  readonly status: number;
  /** Errores de validación por campo, con la clave en camelCase ("idEmpresa"). */
  readonly errores: Record<string, string[]>;
  /** No hubo conexión con la API (red caída, BFF o API sin responder). */
  readonly sinConexion: boolean;
  /** Folio que la API asigna al error; sirve para buscarlo en sus logs. */
  readonly traceId?: string;
  /** Cuerpo de la respuesta tal como llegó (ya parseado si era JSON). */
  readonly data: unknown;

  constructor(status: number, data: unknown, mensaje?: string) {
    const o = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
    super(mensaje ?? detalleDe(o, data) ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.errores = erroresDe(o.errors);
    this.traceId = typeof o.traceId === 'string' ? o.traceId : undefined;
    this.sinConexion = status === 0 || o.sinConexion === true || [502, 503, 504].includes(status);
  }
}

/** Mensaje que manda la API o el BFF, en el orden en que suelen venir. */
function detalleDe(o: Record<string, unknown>, data: unknown): string | undefined {
  for (const k of ['error', 'mensaje', 'message', 'title']) {
    if (typeof o[k] === 'string' && o[k]) return o[k] as string;
  }
  return typeof data === 'string' && data.trim() ? data.trim() : undefined;
}

/**
 * Normaliza el "errors" de ASP.NET ({ "Descripcion": [...], "$.idEmpresa": [...] })
 * a claves camelCase sin prefijos, que son los nombres que usa el formulario.
 */
function erroresDe(raw: unknown): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const msgs = (Array.isArray(v) ? v : [v]).filter((m): m is string => typeof m === 'string' && !!m);
    if (!msgs.length) continue;
    const ultimo = k.replace(/^\$\.?/, '').replace(/\[\d+\]/g, '').split('.').pop() ?? '';
    const campo = ultimo ? ultimo[0].toLowerCase() + ultimo.slice(1) : '';
    out[campo] = [...(out[campo] ?? []), ...msgs.map(traducir)];
  }
  // Si un campo no se pudo convertir, ASP.NET además marca el cuerpo completo
  // ("command" es el parámetro de los controladores) como obligatorio. Con el
  // error del campo basta; solo se conserva si es el único.
  if (out.command && Object.keys(out).length > 1) delete out.command;
  return out;
}

/** Traduce los mensajes por omisión de ASP.NET que llegan en inglés. */
function traducir(m: string): string {
  if (/^The .+ field is required\.?$/i.test(m)) return 'Este campo es obligatorio.';
  if (/^The JSON value could not be converted/i.test(m)) return 'El valor no tiene el formato correcto.';
  const max = /maximum length of '?(\d+)'?/i.exec(m);
  if (max) return `Máximo ${max[1]} caracteres.`;
  return m;
}

/** Lee el cuerpo como JSON; si no lo es, como texto. Vacío => undefined. */
async function leerCuerpo(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Devuelve el cuerpo si la respuesta es 2xx; si no, lanza ApiError. */
async function cuerpoOError<T>(res: Response): Promise<T> {
  const data = await leerCuerpo(res);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
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
  let res: Response;
  try {
    res = await fetch(url, { credentials: 'same-origin', ...init });
  } catch {
    // fetch solo lanza si la petición no salió: sin red o el BFF caído.
    throw new ApiError(0, undefined, 'Sin conexión con el servidor.');
  }
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
        : MSG_SIN_PERMISO,
    );
  }
  return res;
}

export async function getJSON<T = unknown>(url: string): Promise<T> {
  return cuerpoOError<T>(await apiFetch(url));
}

/** Envía JSON. Devuelve el cuerpo de la respuesta (undefined si vino vacío). */
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
  return cuerpoOError<T>(r);
}

/**
 * Como sendJSON pero NO lanza con un status de error: devuelve { ok, status, data }.
 * Solo para el login, que interpreta sus propios códigos. Las pantallas usan sendJSON.
 */
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
  const data = ((await leerCuerpo(r)) ?? {}) as T;
  return { ok: r.ok, status: r.status, data };
}

/** Envía un FormData (multipart) — para los importadores. Lanza ApiError si no es 2xx. */
export async function sendForm<T = unknown>(url: string, form: FormData): Promise<T> {
  return cuerpoOError<T>(await apiFetch(url, { method: 'POST', body: form }));
}

// ---- Atajos de autenticación ----
export interface Usuario {
  UsuarioID?: number;
  Email?: string;
  Nombre?: string;
  NombreUsuario?: string;
  /** Rol que el BFF leyó del token de la API: reader, writer o admin. */
  Rol?: string;
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
