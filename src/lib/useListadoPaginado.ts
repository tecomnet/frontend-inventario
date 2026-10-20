// ============================================================
//  Estado de un listado paginado del servidor.
//  La página y el tamaño viven en la URL (?page=2&pageSize=25) para que
//  recargar la pantalla o compartir el enlace no regrese a la primera.
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { describirError } from './errores';
import {
  PAGE_SIZE_DEFAULT, clampPageSize, getPaged,
  type Filtros, type PagedResult,
} from './paged';

export type EstadoCarga = 'cargando' | 'ok' | 'error';

export interface Listado<T> {
  items: T[];
  totalRecords: number;
  totalPages: number;
  page: number;
  pageSize: number;
  estado: EstadoCarga;
  /** Mensaje para el usuario si estado es 'error' (ver lib/errores). */
  errMsg: string;
  /** Cambia de página (escribe en la URL). */
  irA: (page: number, replace?: boolean) => void;
  /** Cambia el tamaño de página y regresa a la primera. */
  cambiarPageSize: (n: number) => void;
  /** Vuelve a pedir la página actual (tras guardar o dar de baja). */
  recargar: () => Promise<void>;
}

/** Resultado en memoria, atado a la consulta que lo produjo. */
interface Carga<T> {
  consulta: string;
  estado: 'ok' | 'error';
  res: PagedResult<T>;
  errMsg: string;
}

const vacio = <T,>(pageSize: number): PagedResult<T> =>
  ({ data: [], totalRecords: 0, page: 1, pageSize, totalPages: 0 });

export function useListadoPaginado<T>(url: string, filtros: Filtros = {}): Listado<T> {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const pageSize = clampPageSize(Number(params.get('pageSize')) || PAGE_SIZE_DEFAULT);

  // Se serializa para que un objeto literal nuevo en cada render del componente
  // que usa el hook no vuelva a disparar la carga.
  const filtrosKey = JSON.stringify(filtros);
  /** Identifica la consulta actual: si el resultado guardado es de otra, se está cargando. */
  const consulta = `${url}|${page}|${pageSize}|${filtrosKey}`;

  const [carga, setCarga] = useState<Carga<T> | null>(null);
  // Marca la petición más reciente. Una respuesta que llega tarde (se cambió de
  // página antes de que la API contestara) se descarta: si no, sobrescribiría el
  // resultado nuevo con una consulta vieja y el listado se quedaría en "cargando".
  const ultimaPeticion = useRef(0);

  const irA = useCallback((p: number, replace = false) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      // page=1 no se escribe: deja la URL limpia al inicio del listado.
      if (p <= 1) next.delete('page');
      else next.set('page', String(p));
      return next;
    }, { replace });
  }, [setParams]);

  const cambiarPageSize = useCallback((n: number) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      const ps = clampPageSize(n);
      if (ps === PAGE_SIZE_DEFAULT) next.delete('pageSize');
      else next.set('pageSize', String(ps));
      next.delete('page'); // otro tamaño invalida el número de página actual
      return next;
    });
  }, [setParams]);

  const cargar = useCallback(async () => {
    const peticion = ++ultimaPeticion.current;
    try {
      const res = await getPaged<T>(url, {
        page, pageSize, filtros: JSON.parse(filtrosKey) as Filtros,
      });
      if (peticion !== ultimaPeticion.current) return;
      setCarga({ consulta, estado: 'ok', res, errMsg: '' });
      // ?page= fuera de rango (enlace viejo, registros dados de baja): al último.
      if (res.totalPages > 0 && page > res.totalPages) irA(res.totalPages, true);
    } catch (err) {
      if (peticion !== ultimaPeticion.current) return;
      const errMsg = describirError(err).mensaje;
      // Conserva los totales de la carga anterior para no vaciar la barra.
      setCarga((prev) => ({ consulta, estado: 'error', res: prev?.res ?? vacio<T>(pageSize), errMsg }));
    }
  }, [consulta, url, page, pageSize, filtrosKey, irA]);

  // set-state-in-effect: cargar() solo hace setCarga DESPUÉS del await, nunca de
  // forma sincrónica; la regla no distingue el límite async. Mismo patrón de
  // carga inicial que AuthContext.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void cargar(); }, [cargar]);

  // El estado se deriva: no hay setState de "cargando" que provoque un render extra.
  const alDia = carga?.consulta === consulta;
  const res = carga?.res ?? vacio<T>(pageSize);

  return {
    items: res.data,
    totalRecords: res.totalRecords,
    totalPages: res.totalPages,
    page,
    pageSize,
    estado: alDia ? carga.estado : 'cargando',
    errMsg: alDia ? carga.errMsg : '',
    irA,
    cambiarPageSize,
    recargar: cargar,
  };
}
