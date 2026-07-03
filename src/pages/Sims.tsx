// Administración de Sims (listado paginado del servidor + edición de fechas/estado).
// Equivale a getSims / editarSim / guardarSim del panel viejo.
import { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useUI } from '../context/UIContext';
import { API, getJSON, sendJSONStatus } from '../lib/api';
import { fecha, isoToInput } from '../lib/format';

const PAGE_SIZE = 50;
const ESTADOS_SIM: Record<number, string> = {
  1: 'Registrada', 2: 'Activa', 3: 'Suspendida', 4: 'Reactivada', 5: 'Baja',
};

interface Sim {
  id: number;
  imsi?: string; iccid?: string; msisdn?: string;
  idProducto?: number; productoDescripcion?: string;
  loteTecomnet?: string; loteALtan?: string;
  fechaRegistro?: string; estadoSim?: number;
  fechaCompra?: string; fechaRecepcion?: string; fechaEntrega?: string;
  fechaActivacion?: string; fechaSuspencion?: string; fechaReactivacion?: string;
  fechaInicioFacturacion?: string; fechaBaja?: string;
  fechaInstalacion?: string; fechaVenta?: string; ultimaFecha?: string;
  [k: string]: unknown;
}

interface PagedResult {
  page: number; totalPages: number; totalRecords: number; data: Sim[];
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

export default function Sims() {
  const { notify } = useUI();
  const [result, setResult] = useState<PagedResult>({ page: 1, totalPages: 1, totalRecords: 0, data: [] });
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [edit, setEdit] = useState<Sim | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async (page: number, term: string) => {
    setEstado('cargando');
    try {
      const res = await getJSON<PagedResult>(
        `${API}/Catalogos/simdet/pages?page=${page}&pageSize=${PAGE_SIZE}&search=${encodeURIComponent(term)}`,
      );
      setResult(res);
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => { void cargar(1, ''); }, [cargar]);

  const irA = (page: number) => { if (page >= 1 && page <= result.totalPages) void cargar(page, search); };
  const buscar = () => { setSearch(searchInput); void cargar(1, searchInput); };
  const limpiar = () => { setSearchInput(''); setSearch(''); void cargar(1, ''); };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const orNull = (v?: string) => (v ? v : null);
    const payload = {
      id: edit.id,
      estadoSim: Number(edit.estadoSim),
      fechaInstalacion: orNull(edit.fechaInstalacion),
      fechaActivacion: orNull(edit.fechaActivacion),
      fechaReactivacion: orNull(edit.fechaReactivacion),
      fechaSuspencion: orNull(edit.fechaSuspencion),
      fechaInicioFacturacion: orNull(edit.fechaInicioFacturacion),
      fechaVenta: orNull(edit.fechaVenta),
      ultimaFecha: orNull(edit.ultimaFecha),
      fechaEntrega: orNull(edit.fechaEntrega),
      fechaBaja: orNull(edit.fechaBaja),
    };
    setGuardando(true);
    try {
      const { ok, status } = await sendJSONStatus('PUT', `${API}/Catalogos/simdet`, payload);
      if (!ok) throw new Error('HTTP ' + status);
      notify('SIM actualizada.', 'success');
      setEdit(null);
      await cargar(result.page, search);
    } catch (err) {
      notify('No se pudo guardar: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const setEditDate = (k: keyof Sim, v: string) => setEdit((s) => (s ? { ...s, [k]: v } : s));

  const dateField = (label: string, k: keyof Sim) => (
    <div className="form-group">
      <label>{label}</label>
      <input type="date" value={isoToInput(edit?.[k] as string)} onChange={(e) => setEditDate(k, e.target.value)} />
    </div>
  );

  return (
    <AppLayout active="sims">
      <div className="mb-4">
        <span className="eyebrow">Catálogo</span>
        <h1 className="page-title mb-0">Sims</h1>
        <p className="page-subtitle">
          Página {result.page} de {result.totalPages} · Total registros: {result.totalRecords}
        </p>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Buscar ICCID, IMSI o MSISDN..." value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') buscar(); }} />
        <button className="btn btn-tec" onClick={buscar}><i className="bi bi-search" /> Buscar</button>
        <button className="btn btn-secondary" onClick={limpiar}><i className="bi bi-funnel" /> Limpiar filtro</button>
      </div>

      {edit && (
        <div className="form-card">
          <div className="entity-form-header">
            <div><span className="eyebrow">Editar</span><h3>SIM {edit.id} · {edit.iccid ?? ''}</h3></div>
            <button className="action-btn" type="button" onClick={() => setEdit(null)}><i className="bi bi-x-lg" /></button>
          </div>
          <form onSubmit={guardar} noValidate>
            <div className="entity-grid">
              <div className="form-group">
                <label>Estado Sim</label>
                <select value={Number(edit.estadoSim) || ''} onChange={(e) => setEditDate('estadoSim', e.target.value)}>
                  {Object.entries(ESTADOS_SIM).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                </select>
              </div>
              {dateField('F. Instalación', 'fechaInstalacion')}
              {dateField('F. Activación', 'fechaActivacion')}
              {dateField('F. Reactivación', 'fechaReactivacion')}
              {dateField('F. Suspensión', 'fechaSuspencion')}
              {dateField('F. Inicio Facturación', 'fechaInicioFacturacion')}
              {dateField('F. Venta', 'fechaVenta')}
              {dateField('Última fecha', 'ultimaFecha')}
              {dateField('F. Entrega', 'fechaEntrega')}
              {dateField('F. Baja', 'fechaBaja')}
            </div>
            <div className="entity-actions">
              <button className="btn btn-primary px-4" type="submit" disabled={guardando}>Guardar cambios</button>
              <button className="btn btn-secondary px-4" type="button" onClick={() => setEdit(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Editar</th><th>Id</th><th>Imsi</th><th>Iccid</th><th>Msisdn</th><th>Producto</th>
              <th>Desc. Producto</th><th>Lote Tecomnet</th><th>Lote Altan</th><th>F. Registro</th><th>Estado Sim</th>
              <th>F. Compra</th><th>F. Recepción</th><th>F. Entrega</th><th>F. Activación</th><th>F. Suspensión</th>
              <th>F. Reactivación</th><th>F. Inicio Facturación</th><th>F. Baja</th>
            </tr>
          </thead>
          <tbody>
            {estado === 'cargando' && <tr><td colSpan={19} className="text-center text-muted py-4">Cargando…</td></tr>}
            {estado === 'error' && <tr><td colSpan={19} className="text-center text-danger py-4">Error cargando sims.</td></tr>}
            {estado === 'ok' && result.data.length === 0 && <tr><td colSpan={19} className="text-center text-muted py-4">Sin registros.</td></tr>}
            {estado === 'ok' && result.data.map((p) => (
              <tr key={p.id}>
                <td><button className="action-btn edit" title="Editar" onClick={() => setEdit(p)}><i className="bi bi-pencil" /></button></td>
                <td>{p.id}</td><td>{p.imsi}</td><td>{p.iccid}</td><td>{p.msisdn}</td><td>{p.idProducto}</td>
                <td>{p.productoDescripcion}</td><td>{p.loteTecomnet}</td><td>{p.loteALtan}</td><td>{fecha(p.fechaRegistro)}</td>
                <td>{ESTADOS_SIM[Number(p.estadoSim)] ?? p.estadoSim}</td>
                <td>{fecha(p.fechaCompra)}</td><td>{fecha(p.fechaRecepcion)}</td><td>{fecha(p.fechaEntrega)}</td>
                <td>{fecha(p.fechaActivacion)}</td><td>{fecha(p.fechaSuspencion)}</td><td>{fecha(p.fechaReactivacion)}</td>
                <td>{fecha(p.fechaInicioFacturacion)}</td><td>{fecha(p.fechaBaja)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className="pagination-bar">
          <button className="page-btn" onClick={() => irA(result.page - 1)} disabled={result.page <= 1}>
            <i className="bi bi-chevron-left" /> Anterior
          </button>
          {pageWindow(result.page, result.totalPages).map((p, i) =>
            p === '…'
              ? <span key={`e${i}`} className="pagination-ellipsis">…</span>
              : <button key={p} className={`page-btn${p === result.page ? ' active' : ''}`}
                  onClick={() => irA(p)} disabled={p === result.page}>{p}</button>,
          )}
          <button className="page-btn" onClick={() => irA(result.page + 1)} disabled={result.page >= result.totalPages}>
            Siguiente <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}
    </AppLayout>
  );
}
