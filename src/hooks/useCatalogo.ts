// Carga un catálogo completo para mostrar nombres en lugar de ids en las tablas.
import { useEffect, useState } from 'react';
import { API, getJSON } from '../lib/api';
import { normalizePaged } from '../lib/paged';

const URLS = {
  empresas: `${API}/Catalogos/empresas`,
  udn: `${API}/Catalogos/unidadesnegocio`,
  almacenes: `${API}/Catalogos/almacenes`,
  productos: `${API}/Productos`,
};

interface Opcion { id: number; descripcion: string; empresaId?: number; udnId?: number }

/** Sin page ni search la API devuelve el catálogo completo. */
export function useCatalogo(catalogo: keyof typeof URLS): Opcion[] {
  const [lista, setLista] = useState<Opcion[]>([]);
  useEffect(() => {
    let cancelado = false;
    getJSON<unknown>(URLS[catalogo])
      .then((r) => { if (!cancelado) setLista(normalizePaged<Opcion>(r, 0).data); })
      .catch(() => { /* sin catálogo, la tabla muestra el id */ });
    return () => { cancelado = true; };
  }, [catalogo]);
  return lista;
}

/** Descripción del registro con ese id; si no lo encuentra, el id. */
export function nombreDe(lista: Opcion[], id: number, filtro: (o: Opcion) => boolean = () => true) {
  return lista.find((o) => o.id === id && filtro(o))?.descripcion ?? id;
}
