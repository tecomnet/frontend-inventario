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
import { getSession, setSession, clearSession, type Usuario } from './session.js';
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

  // Exige una sesión de panel válida. Devuelve el usuario o responde 401.
  const requireAuth = (req: Request, res: Response): Usuario | null => {
    const user = getSession(req);
    if (!user) {
      res.status(401).json({ error: 'Sesión expirada o no autenticado', login: true });
      return null;
    }
    setSession(req, res, user); // navegar/usar el panel cuenta como actividad
    return user;
  };

  // ---------------- AUTH ----------------
  app.all('/api/auth', async (req, res) => {
    const action = String(req.query.action ?? '');

    if (action === 'login') {
      const raw = jsonBody(req);
      const email = String(raw.Email ?? raw.email ?? '').trim();
      const password = String(raw.Password ?? raw.password ?? '');
      if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Captura correo y contraseña.' });
      }

      // MODO PLACEHOLDER: aún no hay endpoint de login en la API de Inventario.
      // Acepta cualquier credencial y crea sesión, para dejar la interfaz lista.
      // Cuando exista el endpoint real, pon AUTH_MODE=api y AUTH_LOGIN_PATH.
      if (AUTH_MODE !== 'api') {
        const user: Usuario = { Email: email, Nombre: email.split('@')[0] };
        setSession(req, res, user);
        return res.json({ ok: true });
      }

      // MODO API: valida contra la API de Inventario.
      const { code, body } = await apiProxy(
        'POST',
        AUTH_LOGIN_PATH,
        Buffer.from(JSON.stringify({ Email: email, Password: password })),
        'application/json',
      );
      if (code >= 200 && code < 300) {
        let user: Usuario = { Email: email };
        try {
          const data = JSON.parse(body);
          user = data.usuario ?? data.Usuario ?? data ?? { Email: email };
        } catch { /* noop */ }
        setSession(req, res, user);
        return res.json({ ok: true });
      }
      let msg = 'Usuario o contraseña no válida.';
      try {
        const j = JSON.parse(body);
        msg = j.mensaje ?? j.ErrorMessage ?? j.error ?? msg;
      } catch { /* noop */ }
      return res.status(401).json({ ok: false, mensaje: msg });
    }

    if (action === 'logout') {
      clearSession(req, res);
      return res.json({ ok: true });
    }

    if (action === 'check') {
      const user = getSession(req);
      if (user) setSession(req, res, user); // refresca ventana de inactividad
      return res.json({ authenticated: !!user, user: user ?? null });
    }

    return res.status(400).json({ error: 'Acción no válida' });
  });

  // ---------------- PROXY genérico hacia la API de Inventario ----------------
  // Cualquier /api/<ruta> (excepto /api/auth) se reenvía a API_BASE/<ruta>.
  app.all(/^\/api(\/|$)/, async (req, res) => {
    if (!requireAuth(req, res)) return;

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
    );

    res
      .status(code || 502)
      .type(respType)
      .send(resp !== '' ? resp : JSON.stringify({ ok: code >= 200 && code < 400 }));
  });

  return app;
}
