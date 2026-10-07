// Traduce cualquier error de una petición a un mensaje para el usuario.
// Es la ÚNICA interpretación de errores del panel: las pantallas no leen
// "errors", "title" ni "message" por su cuenta (lo muestra notifyError de
// UIContext y, en formularios, useErroresForm).
import { ApiError, MSG_SIN_PERMISO } from './api';

export const MSG_SIN_CONEXION =
  'Sin conexión con la API de Inventario. Revisa tu conexión o intenta más tarde.';

export interface ErrorDescrito {
  mensaje: string;
  variante: 'danger' | 'warning';
  /** Errores de validación por campo (solo en un 400). */
  campos: Record<string, string[]>;
  /** 401: el aviso ya lo da la redirección al login; no se muestra nada más. */
  silencioso: boolean;
}

export function describirError(err: unknown): ErrorDescrito {
  const base = { variante: 'danger' as const, campos: {}, silencioso: false };

  if (!(err instanceof ApiError)) {
    const detalle = err instanceof Error && err.message ? ` (${err.message})` : '';
    return { ...base, mensaje: `Ocurrió un error inesperado en la pantalla${detalle}.` };
  }

  // Mensaje propio de la API/BFF, si mandó uno. El "title" genérico de una
  // validación de ASP.NET viene en inglés y no aporta: se descarta.
  const detalle = err.message && !/^HTTP \d+$|validation errors occurred/i.test(err.message)
    ? err.message
    : '';

  if (err.sinConexion) return { ...base, mensaje: MSG_SIN_CONEXION };

  switch (err.status) {
    case 400: {
      const hayCampos = Object.keys(err.errores).length > 0;
      return {
        ...base,
        campos: err.errores,
        mensaje: hayCampos
          ? 'Hay datos inválidos. Revisa los campos marcados.'
          : detalle || 'La solicitud tiene datos inválidos.',
      };
    }
    case 401:
      return { ...base, silencioso: true, mensaje: 'Tu sesión expiró. Vuelve a iniciar sesión.' };
    case 403:
      return { ...base, variante: 'warning', mensaje: detalle || MSG_SIN_PERMISO };
    case 404:
      return { ...base, mensaje: detalle || 'No se encontró el registro. Es posible que ya no exista.' };
    case 409:
      return {
        ...base,
        mensaje: detalle || 'La operación entra en conflicto con otro registro (duplicado o en uso).',
      };
  }

  if (err.status >= 500) {
    const folio = err.traceId ? ` (folio ${err.traceId})` : '';
    return { ...base, mensaje: `La API tuvo un error interno. Intenta de nuevo; si continúa, avisa a soporte${folio}.` };
  }
  return { ...base, mensaje: detalle || `La API respondió con un error inesperado (HTTP ${err.status}).` };
}

/** Busca un campo sin distinguir mayúsculas ("IdEmpresa" de la API = "idEmpresa" del form). */
export function erroresDeCampo(
  campos: Record<string, string[]>,
  campo: string,
): string[] | undefined {
  const k = Object.keys(campos).find((c) => c.toLowerCase() === campo.toLowerCase());
  return k ? campos[k] : undefined;
}

/** Separa los errores de los campos que la pantalla muestra de los demás. */
export function separarCampos(
  campos: Record<string, string[]>,
  enPantalla: readonly string[],
): { visibles: Record<string, string[]>; resto: Record<string, string[]> } {
  const nombres = new Set(enPantalla.map((c) => c.toLowerCase()));
  const visibles: Record<string, string[]> = {};
  const resto: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(campos)) {
    (nombres.has(k.toLowerCase()) ? visibles : resto)[k] = v;
  }
  return { visibles, resto };
}
