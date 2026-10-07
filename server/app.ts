// ============================================================
//  BFF Express del Inventario.
//    /api/auth      login / logout / check (sesión del panel)
//    /api/*         proxy genérico hacia la API de Inventario
//  El navegador siempre habla con el mismo origen; el BFF reenvía
//  cada petición (incluidas las multipart de los importadores) con el
//  Authorization: Bearer de la sesión, que la API exige desde KL-7.
//
//  Los errores que el front necesita distinguir se responden distintos:
//    401 sin-sesion      -> no hay sesión de panel (401 propio del BFF).
//    401 token-expirado  -> la API rechazó el token: se cierra la sesión.
//    403 sinPermiso      -> falta permiso: la sesión NO se toca.
//    502 sinConexion     -> la API no respondió (red, DNS, timeout).
// ============================================================
import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { apiProxy } from './apiClient.js';
import jwt from 'jsonwebtoken';
import {
  getSession, setSession, clearSession, type Sesion, type Usuario,
} from './session.js';
import { AUTH_MODE, AUTH_LOGIN_PATH } from './config.js';

// La API firma el rol dos veces (AuthController): como "role" y como la URI
// de ClaimTypes.Role. Cada una puede venir como texto o como arreglo si el
// usuario tuviera varios roles; en ese caso se queda el de mayor alcance.
const CLAIM_ROL_URI = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const ROLES_POR_ALCANCE = ['admin', 'writer', 'reader'];

function rolDelToken(token: string): string | null {
  const claims = (jwt.decode(token) ?? {}) as Record<string, unknown>;
  const roles = [claims.role, claims[CLAIM_ROL_URI]]
    .flat()
    .filter((r): r is string => typeof r === 'string' && r.trim() !== '')
    .map((r) => r.trim().toLowerCase());
  return ROLES_POR_ALCANCE.find((r) => roles.includes(r)) ?? roles[0] ?? null;
}

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

  // Saca un mensaje legible del cuerpo de error de la API (si viene en JSON).
  const mensajeApi = (body: string): string | null => {
    try {
      const d = JSON.parse(body) as Record<string, unknown>;
      const m = [d.mensaje, d.error, d.title, d.detail]
        .find((x) => typeof x === 'string' && x.trim() !== '');
      return (m as string | undefined) ?? null;
    } catch {
      return null;
    }
  };

  // Exige una sesión de panel válida. Devuelve la sesión o responde 401.
  // Este es el 401 *del BFF*: no hay sesión del panel (nunca inició o la cookie
  // expiró por inactividad). Es distinto del 401 *de la API* (token vencido),
  // que se maneja abajo en el proxy; el front los diferencia por "motivo".
  const requireAuth = (req: Request, res: Response): Sesion | null => {
    const sesion = getSession(req);
    if (!sesion) {
      res.status(401).json({
        error: 'Tu sesión expiró por inactividad. Vuelve a iniciar sesión.',
        login: true,
        motivo: 'sin-sesion',
      });
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
        // Rol admin para que en local se vea el panel completo, como hoy.
        setSession(req, res, {
          user: { NombreUsuario: username, Nombre: username, Rol: 'admin' },
          token: null,
        });
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
        // Rol del usuario, leído de los claims del token. Solo sirve para la
        // experiencia (mostrarlo y ocultar acciones); quien decide de verdad
        // es la API, que valida el token y su rol en cada petición.
        const user: Usuario = { NombreUsuario: username, Nombre: username };
        const rol = rolDelToken(token);
        if (rol) user.Rol = rol;
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

    // La API exige JWT en todos sus endpoints (KL-7). Una sesión sin token no
    // sirve para hablar con ella (p. ej. se creó en modo placeholder y el BFF
    // reinició en modo api): se cierra y se manda al login como token vencido.
    if (AUTH_MODE === 'api' && !sesion.token) {
      clearSession(req, res);
      return res.status(401).json({
        error: 'Tu sesión ya no es válida. Vuelve a iniciar sesión.',
        login: true,
        motivo: 'token-expirado',
      });
    }

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

    // 401 *de la API*: rechazó el token (expiró o es inválido). Se cierra la
    // sesión del panel para que el front mande al login UNA vez, con aviso, en
    // lugar de reintentar contra un token muerto y quedar en un ciclo.
    if (code === 401) {
      clearSession(req, res);
      return res.status(401).json({
        error: 'Tu sesión expiró. Vuelve a iniciar sesión.',
        login: true,
        motivo: 'token-expirado',
      });
    }

    // 403 de la API: el token es válido pero el rol no alcanza para esta
    // operación. NO es sesión expirada: la sesión se conserva y el front solo
    // muestra un aviso de "sin permiso".
    if (code === 403) {
      const msg = mensajeApi(resp) ?? 'No tienes permiso para realizar esta acción.';
      // El mensaje va en "error" y en "title": esa es la clave que ya leen las
      // pantallas al reportar un guardado fallido.
      return res.status(403).json({ error: msg, title: msg, sinPermiso: true });
    }

    // Sin respuesta de la API (red, DNS, timeout): 502 con "sinConexion" para
    // que el front lo distinga de un error que sí devolvió la API.
    if (code === 0) {
      return res.status(502).json({
        error: 'No hay conexión con la API de Inventario.',
        sinConexion: true,
      });
    }

    res
      .status(code)
      .type(respType)
      .send(resp !== '' ? resp : JSON.stringify({ ok: code >= 200 && code < 400 }));
  });

  return app;
}
