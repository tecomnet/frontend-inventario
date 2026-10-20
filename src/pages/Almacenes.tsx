// Administración de Almacenes (alta, edición, baja).
// Equivale a getAlmacenes / renderAlmacenForm / guardarAlmacen / bajaAlmacen del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { API, avisoSinPermiso, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { usePermisos } from '../hooks/usePermisos';
import { siNo } from '../lib/format';

// La API lista con id/empresaId/udnId y el PUT recibe idAlmacen/idEmpresa/idUdn;
// el formulario trabaja con los nombres del PUT y acepta los dos al leer.
interface Almacen {
  idAlmacen: number;
  id?: number;
  descripcion?: string;
  tipo?: string;
  idEmpresa?: number;
  empresaId?: number;
  idUdn?: number;
  udnId?: number;
  esActivo?: boolean;
}

const vacio: Almacen = { idAlmacen: 0, descripcion: '', tipo: '', idEmpresa: 0, idUdn: 0, esActivo: true };

const normalizar = (a: Almacen): Almacen => ({
  ...a,
  idAlmacen: a.idAlmacen ?? a.id ?? 0,
  idEmpresa: a.idEmpresa ?? a.empresaId ?? 0,
  idUdn: a.idUdn ?? a.udnId ?? 0,
});

/**
 * El almacén no tiene un solo id: su llave es empresa + udn + almacén.
 * Ojo con el orden: la API lo pide como {empresaId}/{udnId}/{almacenId}.
 * Devuelve null si falta alguna parte (no se puede editar ni borrar).
 */
const rutaDe = (a: Almacen): string | null => {
  const { idEmpresa = 0, idUdn = 0, idAlmacen } = normalizar(a);
  if (!idEmpresa || !idUdn || !idAlmacen) return null;
  return `${API}/Catalogos/almacenes/${idEmpresa}/${idUdn}/${idAlmacen}`;
};

export default function Almacenes() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Almacen>(`${API}/Catalogos/almacenes`);
  const { items, estado } = listado;
  const { puedeEscribir } = usePermisos();
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Almacen>(vacio);
  // Alta o edición se decide por esto y no por idAlmacen > 0, para que editar
  // un almacén sin llave completa nunca termine creando otro.
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setForm(vacio); setEditando(false); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (a: Almacen) => {
    setForm(normalizar(a)); setEditando(true);
    setVista('form'); window.scrollTo(0, 0);
  };

  const set = <K extends keyof Almacen>(k: K, v: Almacen[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = editando;
    const ruta = isEdit ? rutaDe(form) : `${API}/Catalogos/almacenes`;
    if (!ruta) {
      notify('No se puede editar: el API no devolvió la llave completa del almacén.', 'danger');
      return;
    }
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      tipo: (form.tipo ?? '').trim(),
      idEmpresa: form.idEmpresa ?? 0,
      idUdn: form.idUdn ?? 0,
      esActivo: form.esActivo ?? true,
    };
    const payload = isEdit ? { idAlmacen: form.idAlmacen, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', ruta, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Almacén actualizado.' : 'Almacén creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (a: Almacen) => {
    const ruta = rutaDe(a);
    if (!ruta) {
      notify('No se puede dar de baja: el API no devolvió la llave completa del almacén.', 'danger');
      return;
    }
    if (!window.confirm(`¿Dar de baja el almacén ${normalizar(a).idAlmacen} (${a.descripcion ?? ''})?`)) return;
    try {
      const { ok, status, data } = await sendJSONStatus('DELETE', ruta);
      const aviso = avisoSinPermiso(status, data);
      if (aviso) { notify(aviso, 'warning'); return; }
      if (!ok) throw new Error('HTTP ' + status);
      notify('Almacén dado de baja.', 'success');
      await listado.recargar();
    } catch {
      notify('No se pudo dar de baja el almacén. Revisa el API.', 'danger');
    }
  };

  return (
    <AppLayout active="almacenes">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Almacenes</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nuevo almacén</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>Tipo</th><th>Empresa</th><th>UDN</th><th>Activo</th>{puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={7} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={7} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((raw, i) => {
                    const a = normalizar(raw);
                    return (
                      <tr key={`${a.idEmpresa}-${a.idUdn}-${a.idAlmacen}-${i}`}>
                        <td>{a.idAlmacen}</td><td>{a.descripcion}</td><td>{a.tipo}</td><td>{a.idEmpresa}</td><td>{a.idUdn}</td><td>{siNo(a.esActivo)}</td>
                        {puedeEscribir && <td className="text-end">
                          <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(a)}><i className="bi bi-pencil" /></button>
                          <button className="action-btn disable" title="Dar de baja" onClick={() => baja(a)}><i className="bi bi-slash-circle" /></button>
                        </td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Paginacion
            page={listado.page} pageSize={listado.pageSize}
            totalRecords={listado.totalRecords} totalPages={listado.totalPages}
            onPage={listado.irA} onPageSize={listado.cambiarPageSize}
            etiqueta="almacenes"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{editando ? `Editar almacén ${form.idAlmacen}` : 'Nuevo almacén'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Tipo</label>
                  <input type="text" value={form.tipo ?? ''} onChange={(e) => set('tipo', e.target.value)} required /></div>
                <div className="form-group"><label>Empresa Id</label>
                  <input type="number" min={1} step={1} value={form.idEmpresa ?? 0} onChange={(e) => set('idEmpresa', num(e.target.value))} disabled={editando} required /></div>
                <div className="form-group"><label>UDN Id</label>
                  <input type="number" min={1} step={1} value={form.idUdn ?? 0} onChange={(e) => set('idUdn', num(e.target.value))} disabled={editando} required /></div>
                <label className="check-field"><input type="checkbox" checked={form.esActivo ?? true} onChange={(e) => set('esActivo', e.target.checked)} /> Activo</label>
              </div>
            </form>
          </div>
          <div className="entity-actions">
            <button type="button" className="btn btn-primary px-4" onClick={guardar} disabled={guardando}>Guardar</button>
            <button type="button" className="btn btn-secondary px-4" onClick={() => setVista('lista')}>Cancelar</button>
          </div>
        </>
      )}
    </AppLayout>
  );
}
