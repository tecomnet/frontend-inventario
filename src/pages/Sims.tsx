// Administración de Sims (listado paginado del servidor + edición de fechas/estado).
// Equivale a getSims / editarSim / guardarSim del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { API, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { fecha, isoToInput } from '../lib/format';

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

/** Filtros que acepta GET /Catalogos/simdet. */
interface FiltrosSim {
  search: string;
  lote: string;
  estadoSim: string;
  productoId: string;
}

const SIN_FILTROS: FiltrosSim = { search: '', lote: '', estadoSim: '', productoId: '' };

export default function Sims() {
  const { notify } = useUI();
  // "form" es lo que se está escribiendo; "filtros" lo ya aplicado (lo que se consulta).
  const [form, setForm] = useState<FiltrosSim>(SIN_FILTROS);
  const [filtros, setFiltros] = useState<FiltrosSim>(SIN_FILTROS);
  const listado = useListadoPaginado<Sim>(`${API}/Catalogos/simdet`, { ...filtros });
  const { items, estado } = listado;

  const [edit, setEdit] = useState<Sim | null>(null);
  const [guardando, setGuardando] = useState(false);

  const setFiltro = (k: keyof FiltrosSim, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const buscar = () => { setFiltros(form); listado.irA(1); };
  const limpiar = () => { setForm(SIN_FILTROS); setFiltros(SIN_FILTROS); listado.irA(1); };
  const enEnter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') buscar(); };

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
      await listado.recargar();
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
        <p className="page-subtitle">Listado paginado del servidor. Usa los filtros para acotar la búsqueda.</p>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Buscar ICCID, IMSI o MSISDN..." value={form.search}
          onChange={(e) => setFiltro('search', e.target.value)} onKeyDown={enEnter} />
        <input type="text" className="narrow" placeholder="Lote" value={form.lote}
          onChange={(e) => setFiltro('lote', e.target.value)} onKeyDown={enEnter} />
        <select value={form.estadoSim} onChange={(e) => setFiltro('estadoSim', e.target.value)}>
          <option value="">Estado: todos</option>
          {Object.entries(ESTADOS_SIM).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>
        <input type="number" className="narrow" min={1} step={1} placeholder="Producto Id" value={form.productoId}
          onChange={(e) => setFiltro('productoId', e.target.value)} onKeyDown={enEnter} />
        <button className="btn btn-tec" onClick={buscar}><i className="bi bi-search" /> Buscar</button>
        <button className="btn btn-secondary" onClick={limpiar}><i className="bi bi-funnel" /> Limpiar filtros</button>
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
            {estado === 'ok' && items.length === 0 && <tr><td colSpan={19} className="text-center text-muted py-4">Sin registros.</td></tr>}
            {estado === 'ok' && items.map((p) => (
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

      <Paginacion
        page={listado.page} pageSize={listado.pageSize}
        totalRecords={listado.totalRecords} totalPages={listado.totalPages}
        onPage={listado.irA} onPageSize={listado.cambiarPageSize}
        etiqueta="sims"
      />
    </AppLayout>
  );
}
