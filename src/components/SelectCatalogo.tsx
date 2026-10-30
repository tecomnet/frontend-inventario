import { useEffect, useState } from 'react';
import { API } from '../lib/api';
import { getPaged, PAGE_SIZE_MAX } from '../lib/paged';

const URLS = {
  marcas: `${API}/Catalogos/marcas`,
  lineas: `${API}/Catalogos/lineas`,
  presentaciones: `${API}/Catalogos/presentaciones`,
  unidades: `${API}/Catalogos/unidadesmedida`,
  empresas: `${API}/Catalogos/empresas`,
  udn: `${API}/Catalogos/unidadesnegocio`,
  almacenes: `${API}/Catalogos/almacenes`,
  productos: `${API}/Productos`,
};

interface Opcion { id: number; descripcion: string; empresaId?: number; udnId?: number }

interface Props {
  catalogo: keyof typeof URLS;
  value?: number | null;
  onChange: (id: number | null) => void;
  invalido?: boolean;
  required?: boolean;
  empresaId?: number | null;
  udnId?: number | null;
  disabled?: boolean;
}

export function SelectCatalogo({ catalogo, value, onChange, invalido, required, disabled, empresaId, udnId }: Props) {
  const [texto, setTexto] = useState('');
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    const t = setTimeout(async () => {
      try {
        const r = await getPaged<Opcion>(URLS[catalogo], {
          page: 1, pageSize: PAGE_SIZE_MAX, filtros: { search: texto },
        });
        if (!cancelado) { setOpciones(r.data); setTotal(r.totalRecords); setError(null); }
      } catch {
        if (!cancelado) setError('No se pudo cargar el catálogo.');
      }
    }, 300);
    return () => { cancelado = true; clearTimeout(t); };
  }, [catalogo, texto]);

  const visibles = opciones.filter((o) =>
    (!empresaId || o.empresaId === empresaId) && (!udnId || o.udnId === udnId));

  const necesitaBuscar = texto !== '' || total > opciones.length;

  return (
    <div>
      {necesitaBuscar && (
        <input
          type="search"
          placeholder="Buscar…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      )}
      <select
        aria-invalid={invalido}
        required={required}
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">— Selecciona —</option>
        {!!value && !visibles.some((o) => o.id === value) && (
          <option value={value}>#{value}</option>
        )}
        {visibles.map((o) => (
          <option key={o.id} value={o.id}>{o.descripcion}</option>
        ))}
      </select>
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
}
