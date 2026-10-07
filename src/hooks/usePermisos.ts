// Permisos del usuario del panel según su rol (claim "role" del token de la API).
// Replica las políticas de la API (KL-7):
//   ReadOnly     -> reader, writer, admin
//   WriteAccess  -> writer, admin
// SOLO es experiencia de usuario: ocultar un botón no protege nada. La API
// valida el rol en cada petición y responde 403 si no alcanza.
import { useAuth } from '../context/AuthContext';

const ROLES_ESCRITURA = ['writer', 'admin'];

const ETIQUETAS: Record<string, string> = {
  reader: 'Solo lectura',
  writer: 'Escritura',
  admin: 'Administrador',
};

export interface Permisos {
  /** Rol tal como viene del token, o null si la sesión no lo trae. */
  rol: string | null;
  /** Nombre del rol para mostrar en pantalla. */
  etiquetaRol: string;
  /** Puede crear, editar, dar de baja e importar. Sin rol conocido => false. */
  puedeEscribir: boolean;
}

export function usePermisos(): Permisos {
  const { user } = useAuth();
  const rol = typeof user?.Rol === 'string' && user.Rol ? user.Rol.toLowerCase() : null;
  return {
    rol,
    etiquetaRol: rol ? (ETIQUETAS[rol] ?? rol) : 'Sin rol',
    puedeEscribir: rol !== null && ROLES_ESCRITURA.includes(rol),
  };
}
