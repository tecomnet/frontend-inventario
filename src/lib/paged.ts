// ============================================================
//  Listados paginados de la API de Inventario.
//  Desde KL-12 los GET de listado devuelven un objeto
//    { totalRecords, page, pageSize, data: [...] }
//  en lugar de un arreglo, y se consultan con ?page=&pageSize=.
// ============================================================
import { getJSON } from './api';

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
  /** Derivado: la API no siempre lo manda, se calcula de totalRecords/pageSize. */
  totalPages: number;
}

/** Tamaño de página por omisión de la API. */
export const PAGE_SIZE_DEFAULT = 10;
/** Tope que acepta la API; pedir más no trae más registros. */
export const PAGE_SIZE_MAX = 100;
/** Opciones del selector de tamaño de página. */
export const PAGE_SIZES = [10, 25, 50, 100];

/** Acota el tamaño de página al rango que acepta la API. */
export function clampPageSize(n: number): number {
  if (!Number.isFinite(n) || n < 1) return PAGE_SIZE_DEFAULT;
  return Math.min(Math.trunc(n), PAGE_SIZE_MAX);
}

/** Filtros extra del listado (search, lote, estadoSim…). Vacíos no se envían. */
export type Filtros = Record<string, string | number | boolean | undefined | null>;

/**
 * Normaliza la respuesta de un listado a PagedResult.
 * Tolera que un endpoint todavía devuelva un arreglo pelón (así una pantalla
 * no se rompe si su endpoint aún no está migrado del lado de la API).
 */
export function normalizePaged<T>(raw: unknown, pageSizePedido: number): PagedResult<T> {
  if (Array.isArray(raw)) {
    return {
      data: raw as T[],
      totalRecords: raw.length,
      page: 1,
      pageSize: raw.length || pageSizePedido,
      totalPages: 1,
    };
  }

  const o = (raw ?? {}) as Record<string, unknown>;
  const data = Array.isArray(o.data) ? (o.data as T[]) : [];
  const totalRecords = Number(o.totalRecords) || 0;
  const pageSize = clampPageSize(Number(o.pageSize) || pageSizePedido);
  const page = Math.max(1, Number(o.page) || 1);
  // La API manda totalPages en algunos endpoints (p. ej. simdet) y en otros no.
  const totalPages = Number(o.totalPages) > 0
    ? Number(o.totalPages)
    : Math.ceil(totalRecords / pageSize);

  return { data, totalRecords, page, pageSize, totalPages };
}

/** GET de un listado paginado. Arma ?page=&pageSize= más los filtros no vacíos. */
export async function getPaged<T>(
  url: string,
  { page, pageSize, filtros }: { page: number; pageSize: number; filtros?: Filtros },
): Promise<PagedResult<T>> {
  // URL absoluta temporal: respeta un query string que ya venga en url.
  const u = new URL(url, window.location.origin);
  u.searchParams.set('page', String(Math.max(1, page)));
  u.searchParams.set('pageSize', String(clampPageSize(pageSize)));
  for (const [k, v] of Object.entries(filtros ?? {})) {
    if (v === undefined || v === null || v === '') continue;
    u.searchParams.set(k, String(v));
  }
  const raw = await getJSON<unknown>(`${u.pathname}${u.search}`);
  return normalizePaged<T>(raw, pageSize);
}
