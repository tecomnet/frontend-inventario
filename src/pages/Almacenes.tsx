// Administración de Almacenes (alta, edición, baja).
// Equivale a getAlmacenes / renderAlmacenForm / guardarAlmacen / bajaAlmacen del panel viejo.
import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useUI } from '../context/UIContext';
import { usePermisos } from '../hooks/usePermisos';
import { API, getJSON, avisoSinPermiso, sendJSONStatus } from '../lib/api';
import { siNo } from '../lib/format';

interface Almacen {
  idAlmacen: number;
  id?: number;
  descripcion?: string;
  tipo?: string;
  idEmpresa?: number;
  idUdn?: number;
  esActivo?: boolean;
}

const vacio: Almacen = { idAlmacen: 0, descripcion: '', tipo: '', idEmpresa: 0, idUdn: 0, esActivo: true };

export default function Almacenes() {
  const { notify } = useUI();
  const { puedeEscribir } = usePermisos();
  const [items, setItems] = useState<Almacen[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Almacen>(vacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setEstado('cargando');
    try {
      const data = await getJSON<Almacen[]>(`${API}/Catalogos/almacenes`);
      setItems(Array.isArray(data) ? data : []);
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  };

  useEffect(() => { void cargar(); }, []);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (a: Almacen) => {
    setForm({ ...a, idAlmacen: a.idAlmacen ?? a.id ?? 0 });
    setVista('form'); window.scrollTo(0, 0);
  };

  const set = <K extends keyof Almacen>(k: K, v: Almacen[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const idAlmacen = form.idAlmacen ?? 0;
    const isEdit = idAlmacen > 0;
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      tipo: (form.tipo ?? '').trim(),
      idEmpresa: form.idEmpresa ?? 0,
      idUdn: form.idUdn ?? 0,
      esActivo: form.esActivo ?? true,
    };
    const payload = isEdit ? { idAlmacen, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', `${API}/Catalogos/almacenes`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Almacén actualizado.' : 'Almacén creado.', 'success');
      await cargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (idAlmacen: number) => {
    const a = items.find((x) => (x.idAlmacen ?? x.id ?? 0) === idAlmacen);
    if (!a) return;
    if (!window.confirm(`¿Dar de baja el almacén ${idAlmacen}?`)) return;
    try {
      const { ok, status, data } = await sendJSONStatus('DELETE', `${API}/Catalogos/almacenes`, { idAlmacen, idEmpresa: a.idEmpresa, idUdn: a.idUdn });
      const aviso = avisoSinPermiso(status, data);
      if (aviso) { notify(aviso, 'warning'); return; }
      if (!ok) throw new Error('HTTP ' + status);
      notify('Almacén dado de baja.', 'success');
      await cargar();
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
                  {estado === 'ok' && items.map((a) => {
                    const id = a.idAlmacen ?? a.id ?? 0;
                    return (
                      <tr key={id}>
                        <td>{id}</td><td>{a.descripcion}</td><td>{a.tipo}</td><td>{a.idEmpresa}</td><td>{a.idUdn}</td><td>{siNo(a.esActivo)}</td>
                        {puedeEscribir && <td className="text-end">
                          <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(a)}><i className="bi bi-pencil" /></button>
                          <button className="action-btn disable" title="Dar de baja" onClick={() => baja(id)}><i className="bi bi-slash-circle" /></button>
                        </td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{(form.idAlmacen ?? 0) > 0 ? `Editar almacén ${form.idAlmacen}` : 'Nuevo almacén'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Tipo</label>
                  <input type="text" value={form.tipo ?? ''} onChange={(e) => set('tipo', e.target.value)} required /></div>
                <div className="form-group"><label>Empresa Id</label>
                  <input type="number" min={1} step={1} value={form.idEmpresa ?? 0} onChange={(e) => set('idEmpresa', num(e.target.value))} required /></div>
                <div className="form-group"><label>UDN Id</label>
                  <input type="number" min={1} step={1} value={form.idUdn ?? 0} onChange={(e) => set('idUdn', num(e.target.value))} required /></div>
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
