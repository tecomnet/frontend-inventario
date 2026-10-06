// Barra de paginación reutilizable: total de registros, anterior/siguiente,
// ventana de números de página y selector de tamaño. La lógica de estado vive
// en useListadoPaginado; aquí solo se dibuja.
import { PAGE_SIZES } from '../lib/paged';

interface Props {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPage: (page: number) => void;
  onPageSize: (n: number) => void;
  /** Nombre de lo que se lista, para el conteo ("3 productos"). */
  etiqueta?: string;
}

/** Ventana de páginas: 1 … page-2..page+2 … total. */
function pageWindow(page: number, total: number): (number | '…')[] {
  if (!total || total <= 1) return [];
  const set = new Set<number>([1, total]);
  for (let i = page - 2; i <= page + 2; i++) if (i >= 1 && i <= total) set.add(i);
  const ordered = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let last = 0;
  for (const p of ordered) {
    if (p - last > 1) out.push('…');
    out.push(p);
    last = p;
  }
  return out;
}

export default function Paginacion({
  page, pageSize, totalRecords, totalPages, onPage, onPageSize, etiqueta = 'registros',
}: Props) {
  const irA = (p: number) => { if (p >= 1 && p <= totalPages && p !== page) onPage(p); };

  return (
    <div className="pagination-bar">
      <span className="pagination-total">
        {totalRecords.toLocaleString('es-MX')} {etiqueta}
        {totalPages > 1 && <> · página {page} de {totalPages}</>}
      </span>

      <button className="page-btn" onClick={() => irA(page - 1)} disabled={page <= 1}>
        <i className="bi bi-chevron-left" /> Anterior
      </button>

      {pageWindow(page, totalPages).map((p, i) =>
        p === '…'
          ? <span key={`e${i}`} className="pagination-ellipsis">…</span>
          : <button key={p} className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => irA(p)} disabled={p === page}>{p}</button>,
      )}

      <button className="page-btn" onClick={() => irA(page + 1)} disabled={page >= totalPages}>
        Siguiente <i className="bi bi-chevron-right" />
      </button>

      <label className="pagination-size">
        <span>Por página</span>
        <select value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))}>
          {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
    </div>
  );
}
