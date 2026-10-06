// ============================================================
//  Configuración del BFF del Inventario.
//  Los secretos vienen EXCLUSIVAMENTE de variables de entorno
//  (.env en local, variables de Amplify/Lambda en producción).
// ============================================================

const isProd = process.env.NODE_ENV === 'production';

/** Devuelve la variable de entorno o lanza si no está definida. */
function required(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Falta la variable de entorno requerida: ${name}. ` +
        'Configúrala en .env (local) o en las variables del entorno (Amplify/Lambda).',
    );
  }
  return val;
}

// Endpoint público de la API de Inventario (no es secreto). El BFF le hace de
// proxy: el navegador siempre habla con el mismo origen (/api/*).
export const API_BASE =
  process.env.API_BASE ?? 'https://tecomnet.net/Inventario/api';

export const API_TIMEOUT = Number(process.env.API_TIMEOUT ?? 30) * 1000; // ms

// Inactividad de la sesión del panel (segundos).
export const SESSION_TIMEOUT = Number(process.env.SESSION_TIMEOUT ?? 600);

// Secreto para firmar la cookie de sesión del panel (JWT).
// En producción es obligatorio; en local se permite un valor de desarrollo.
export const SESSION_SECRET = isProd
  ? required('SESSION_SECRET')
  : (process.env.SESSION_SECRET ?? 'dev-only-no-usar-en-produccion');

// ---- Autenticación del login ----
// 'api':         valida contra AUTH_LOGIN_PATH de la API de Inventario (default).
// 'placeholder': acepta cualquier credencial y crea sesión. SOLO para desarrollo
//                local: en producción se ignora y se usa 'api' siempre.
const authModeEnv = (process.env.AUTH_MODE ?? 'api').toLowerCase();
export const AUTH_MODE = !isProd && authModeEnv === 'placeholder' ? 'placeholder' : 'api';
export const AUTH_LOGIN_PATH = process.env.AUTH_LOGIN_PATH ?? '/Auth/login';
