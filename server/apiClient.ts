// ============================================================
//  Cliente HTTP server-side hacia la API de Inventario.
//  Es un proxy simple: reenvía método, ruta, query y cuerpo tal cual
//  (JSON o multipart para los importadores) y devuelve la respuesta.
//  La API de Inventario es abierta, así que NO se inyecta token de app.
// ============================================================
import { API_BASE, API_TIMEOUT } from './config.js';

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), API_TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export interface ApiResult {
  code: number;
  body: string;
  contentType: string;
}

/**
 * Reenvía una petición a la API de Inventario.
 * @param method  GET/POST/PUT/DELETE…
 * @param path    ruta + query relativa a API_BASE (p. ej. "/Productos?x=1")
 * @param body    cuerpo crudo (Buffer) o null
 * @param contentType  Content-Type original (se preserva para multipart/JSON)
 */
export async function apiProxy(
  method: string,
  path: string,
  body: Buffer | null,
  contentType?: string,
): Promise<ApiResult> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body != null && body.length > 0) {
    if (contentType) headers['Content-Type'] = contentType;
  } else if (method === 'POST' || method === 'PUT') {
    // POST/PUT sin cuerpo: algunos servidores exigen Content-Length.
    headers['Content-Length'] = '0';
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE}${path}`, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });
    const text = await res.text();
    return {
      code: res.status,
      body: text,
      contentType: res.headers.get('content-type') ?? 'application/json',
    };
  } catch {
    return { code: 0, body: '', contentType: 'application/json' };
  }
}
