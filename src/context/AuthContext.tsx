// Sesión del usuario del panel: verifica sesión, expone el usuario,
// cierra sesión por inactividad (10 min) o al pulsar Salir, y redirige
// a /login cuando la sesión se cae (401), con el motivo que reporta el BFF.
// Un 403 NO cierra sesión: solo avisa que falta permiso.
import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Auth, setForbiddenHandler, setUnauthorizedHandler, type Usuario,
} from '../lib/api';
import { useUI } from './UIContext';

const TIMEOUT_MS = 10 * 60 * 1000;

interface AuthState {
  user: Usuario | null;
  ready: boolean;
  setUser: (u: Usuario | null) => void;
  /** Cierra sesión. Con "mensaje", el login explica por qué. */
  logout: (mensaje?: string) => void;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { notify } = useUI();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const logout = useCallback((mensaje?: string) => {
    Auth.logout().finally(() => {
      setUser(null);
      navigate('/login', { replace: true, state: mensaje ? { mensaje } : undefined });
    });
  }, [navigate]);

  const reload = useCallback(async () => {
    try {
      const j = await Auth.check();
      setUser(j.authenticated ? j.user : null);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // Verificación inicial de sesión.
  useEffect(() => { void reload(); }, [reload]);

  // 401 en rutas autenticadas => al login, una sola vez (lib/api ya filtra los
  // 401 repetidos) y con el aviso que corresponda al motivo.
  useEffect(() => {
    setUnauthorizedHandler(({ mensaje }) => {
      setUser(null);
      navigate('/login', { replace: true, state: { mensaje } });
    });
    // 403: el token es válido, falta permiso. Se avisa y la sesión sigue viva.
    setForbiddenHandler((mensaje) => notify(mensaje, 'warning'));
  }, [navigate, notify]);

  // Temporizador de inactividad (solo si hay sesión).
  useEffect(() => {
    if (!user) return;
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        () => logout('Tu sesión se cerró por inactividad. Vuelve a iniciar sesión.'),
        TIMEOUT_MS,
      );
    };
    const evs: (keyof DocumentEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    evs.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer.current);
      evs.forEach((e) => document.removeEventListener(e, reset));
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, ready, setUser, logout, reload }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
