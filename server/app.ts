// ============================================================
//  BFF Express del Inventario.
//    /api/auth      login / logout / check (sesión del panel)
//    /api/*         proxy genérico hacia la API de Inventario
//  El navegador siempre habla con el mismo origen; el BFF reenvía
//  cada petición (incluidas las multipart de los importadores).
// ============================================================
import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { apiProxy } from './apiClient.js';
import jwt from 'jsonwebtoken';
import {
  getSession, setSession, clearSession, type Sesion, type Usuario,
} from './session.js';
import { AUTH_MODE, AUTH_LOGIN_PATH } from './config.js';

export function createApp() {
  const app = express();
  app.use(cookieParser());
  // Cuerpo crudo (Buffer) para reenviar JSON y multipart sin alterar el boundary.
  app.use(express.raw({ type: '*/*', limit: '25mb' }));

  const rawBody = (req: Request): Buffer | null => {
    const b = req.body;
    if (b == null) return null;
    if (Buffer.isBuffer(b)) return b.length ? b : null;
    return null;
  };
  const jsonBody = (req: Request): Record<string, unknown> => {
    const b = rawBody(req);
    if (!b) return {};
    try {
      return JSON.parse(b.toString('utf8')) as Record<string, unknown>;
    } catch {
      return {};
    }
  };

  // Exige una sesión de panel válida. Devuelve la sesión o responde 401.
  const requireAuth = (req: Request, res: Response): Sesion | null => {
    const sesion = getSession(req);
    if (!sesion) {
      res.status(401).json({ error: 'Sesión expirada o no autenticado', login: true });
      return null;
    }
    setSession(req, res, sesion); // navegar/usar el panel cuenta como actividad
    return sesion;
  };

  // ---------------- AUTH ----------------
  app.all('/api/auth', async (req, res) => {
    const action = String(req.query.action ?? '');

    if (action === 'login') {
      const raw = jsonBody(req);
      const username = String(raw.Username ?? raw.username ?? '').trim();
      const password = String(raw.Password ?? raw.password ?? '');
      if (!username || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Captura usuario y contraseña.' });
      }

      // MODO PLACEHOLDER (solo fuera de producción, ver config.ts): acepta
      // cualquier credencial y crea sesión sin token de API.
      if (AUTH_MODE === 'placeholder') {
        setSession(req, res, { user: { NombreUsuario: username, Nombre: username }, token: null });
        return res.json({ ok: true });
      }

      // MODO API: valida contra la API de Inventario, que responde { token }.
      const { code, body } = await apiProxy(
        'POST',
        AUTH_LOGIN_PATH,
        Buffer.from(JSON.stringify({ Username: username, Password: password })),
        'application/json',
      );
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(body) as Record<string, unknown>;
      } catch { /* noop */ }

      if (code >= 200 && code < 300) {
        const token = typeof data.token === 'string' ? data.token : '';
        if (!token) {
          return res.status(502).json({ ok: false, mensaje: 'La API no devolvió un token.' });
        }
        // Rol del usuario, leído de los claims del token (solo para mostrarlo;
        // quien valida el token es la API en cada petición).
        const claims = (jwt.decode(token) ?? {}) as Record<string, unknown>;
        const user: Usuario = { NombreUsuario: username, Nombre: username };
        if (typeof claims.role === 'string') user.Rol = claims.role;
        setSession(req, res, { user, token });
        // Solo { ok }: el token nunca sale hacia el navegador.
        return res.json({ ok: true });
      }

      if (code === 0) {
        return res.status(502).json({ ok: false, mensaje: 'No se pudo conectar con la API.' });
      }
      const apiMsg = [data.mensaje, data.title, data.error].find((m) => typeof m === 'string');
      const msg = code >= 500
        ? 'La API no está disponible. Intenta más tarde.'
        : ((apiMsg as string | undefined) ?? 'Usuario o contraseña no válida.');
      return res.status(code >= 500 ? 502 : 401).json({ ok: false, mensaje: msg });
    }

    if (action === 'logout') {
      clearSession(req, res);
      return res.json({ ok: true });
    }

    if (action === 'check') {
      const sesion = getSession(req);
      if (sesion) setSession(req, res, sesion); // refresca ventana de inactividad
      // Solo el usuario: el token de la API nunca se devuelve al navegador.
      return res.json({ authenticated: !!sesion, user: sesion?.user ?? null });
    }

    return res.status(400).json({ error: 'Acción no válida' });
  });

  // ---------------- PROXY genérico hacia la API de Inventario ----------------
  // Cualquier /api/<ruta> (excepto /api/auth) se reenvía a API_BASE/<ruta>.
  app.all(/^\/api(\/|$)/, async (req, res) => {
    const sesion = requireAuth(req, res);
    if (!sesion) return;

    // originalUrl = "/api/Productos?x=1" -> path = "/Productos?x=1"
    const path = req.originalUrl.replace(/^\/api/, '') || '/';
    const method = req.method;
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const body = method === 'GET' || method === 'DELETE' ? null : rawBody(req);
    const contentType = req.headers['content-type'];
    const { code, body: resp, contentType: respType } = await apiProxy(
      method,
      path,
      body,
      contentType,
      sesion.token,
    );

    // La API rechazó el token (expiró o es inválido): se cierra la sesión del
    // panel para que el front vuelva a /login en lugar de quedar en un ciclo.
    if (code === 401) {
      clearSession(req, res);
      return res.status(401).json({ error: 'Sesión expirada o no autenticado', login: true });
    }

    res
      .status(code || 502)
      .type(respType)
      .send(resp !== '' ? resp : JSON.stringify({ ok: code >= 200 && code < 400 }));
  });

  return app;
}
