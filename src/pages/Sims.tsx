// Administración de Sims (listado paginado del servidor + edición de fechas/estado).
// Equivale a getSims / editarSim / guardarSim del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { EstadoSim, SimDet, UpdateSimDet } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { fecha, isoToInput } from '../lib/format';

// Mismos valores que EnumSimDet de la API (Idle=1, Activado=2, Reactivado=3,
// Suspendido=4, Baja=5).
const ESTADOS_SIM: Record<EstadoSim, string> = {
  1: 'Registrada', 2: 'Activa', 3: 'Reactivada', 4: 'Suspendida', 5: 'Baja',
};

// El listado trae el estado por nombre; el PUT y el filtro lo piden por número.
const ESTADO_POR_NOMBRE: Record<string, number> = {
  Idle: 1, Activado: 2, Reactivado: 3, Suspendido: 4, Baja: 5,
};

const estadoNum = (v: unknown): number =>
  typeof v === 'string' && v in ESTADO_POR_NOMBRE ? ESTADO_POR_NOMBRE[v] : Number(v);

const esEstado = (n: number): n is EstadoSim => n in ESTADOS_SIM;

/** Fechas que se editan: las mismas del PUT. */
type CampoFecha = Exclude<keyof UpdateSimDet, 'id' | 'estadoSim'>;
const CAMPOS = [
  'estadoSim', 'fechaInstalacion', 'fechaActivacion', 'fechaReactivacion', 'fechaSuspencion',
  'fechaInicioFacturacion', 'fechaVenta', 'ultimaFecha', 'fechaEntrega', 'fechaBaja',
] as const;

/**
 * Lo que se edita: la fila del listado con el estado como lo pide el PUT
 * (número; mientras se elige puede quedar fuera de rango y se valida al guardar).
 */
type SimEditable = Omit<SimDet, 'estadoSim'> & { estadoSim: number };

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
  const listado = useListadoPaginado<SimDet>(`${API}/Catalogos/simdet`, { ...filtros });
  const { items, estado, errMsg } = listado;
  const { puedeEscribir } = usePermisos();

  const [edit, setEditState] = useState<SimEditable | null>(null);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);
  const setEdit = (s: SimDet | null) => {
    errores.limpiar();
    setEditState(s && { ...s, estadoSim: estadoNum(s.estadoSim) });
  };

  const setFiltro = (k: keyof FiltrosSim, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const buscar = () => { setFiltros(form); listado.irA(1); };
  const limpiar = () => { setForm(SIN_FILTROS); setFiltros(SIN_FILTROS); listado.irA(1); };
  const enEnter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') buscar(); };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    // El PUT reemplaza: las fechas que no se tocaron se reenvían tal como
    // llegaron del listado, y las que se vaciaron viajan como null.
    const orNull = (v?: string | null) => (v ? v : null);
    const { estadoSim } = edit;
    if (!esEstado(estadoSim)) { notify('Selecciona un estado válido.', 'danger'); return; }
    const payload: UpdateSimDet = {
      id: edit.id,
      estadoSim,
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
      await sendJSON('PUT', `${API}/Catalogos/simdet/${edit.id}`, payload);
      notify('SIM actualizada.', 'success');
      setEdit(null);
      await listado.recargar();
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la SIM');
    } finally {
      setGuardando(false);
    }
  };

  const setCampo = <K extends keyof SimEditable>(k: K, v: SimEditable[K]) => {
    setEditState((s) => (s ? { ...s, [k]: v } : s));
    errores.limpiar(k);
  };

  const dateField = (label: string, k: CampoFecha) => (
    <div className="form-group">
      <label>{label}</label>
      <input type="date" aria-invalid={!!errores.de(k)} value={isoToInput(edit?.[k] ?? undefined)} onChange={(e) => setCampo(k, e.target.value)} />
      <CampoError mensajes={errores.de(k)} />
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

      {edit && puedeEscribir && (
        <div className="form-card">
          <div className="entity-form-header">
            <div><span className="eyebrow">Editar</span><h3>SIM {edit.id} · {edit.iccid ?? ''}</h3></div>
            <button className="action-btn" type="button" onClick={() => setEdit(null)}><i className="bi bi-x-lg" /></button>
          </div>
          <form onSubmit={guardar} noValidate>
            <div className="entity-grid">
              <div className="form-group">
                <label>Estado Sim</label>
                <select aria-invalid={!!errores.de('estadoSim')} value={edit.estadoSim || ''} onChange={(e) => setCampo('estadoSim', Number(e.target.value))}>
                  {Object.entries(ESTADOS_SIM).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                </select>
                <CampoError mensajes={errores.de('estadoSim')} />
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
              {puedeEscribir && <th>Editar</th>}<th>Id</th><th>Imsi</th><th>Iccid</th><th>Msisdn</th><th>Producto</th>
              <th>Desc. Producto</th><th>Lote Tecomnet</th><th>Lote Altan</th><th>F. Registro</th><th>Estado Sim</th>
              <th>F. Compra</th><th>F. Recepción</th><th>F. Entrega</th><th>F. Activación</th><th>F. Suspensión</th>
              <th>F. Reactivación</th><th>F. Inicio Facturación</th><th>F. Baja</th>
            </tr>
          </thead>
          <tbody>
            {estado === 'cargando' && <tr><td colSpan={19} className="text-center text-muted py-4">Cargando…</td></tr>}
            {estado === 'error' && <tr><td colSpan={19} className="text-center text-danger py-4">{errMsg || 'Error cargando sims.'}</td></tr>}
            {estado === 'ok' && items.length === 0 && <tr><td colSpan={19} className="text-center text-muted py-4">Sin registros.</td></tr>}
            {estado === 'ok' && items.map((p) => (
              <tr key={p.id}>
                {puedeEscribir && <td><button className="action-btn edit" title="Editar" onClick={() => setEdit(p)}><i className="bi bi-pencil" /></button></td>}
                <td>{p.id}</td><td>{p.imsi}</td><td>{p.iccid}</td><td>{p.msisdn}</td><td>{p.idProducto}</td>
                <td>{p.productoDescripcion}</td><td>{p.loteTecomnet}</td><td>{p.loteALtan}</td><td>{fecha(p.fechaRegistro)}</td>
                <td>{ESTADOS_SIM[estadoNum(p.estadoSim) as EstadoSim] ?? p.estadoSim}</td>
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
