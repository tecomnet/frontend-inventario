// Administración de Líneas (alta, edición). Sin baja.
// Equivale a getLineas / renderLineaForm / guardarLinea del panel viejo.
import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useUI } from '../context/UIContext';
import { API, getJSON, sendJSONStatus } from '../lib/api';
import { siNo } from '../lib/format';

interface Linea {
  id: number;
  descripcion?: string;
  idLineaPadre?: number;
  esActiva?: boolean;
}

const vacio: Linea = { id: 0, descripcion: '', idLineaPadre: 0, esActiva: true };

export default function Lineas() {
  const { notify } = useUI();
  const [items, setItems] = useState<Linea[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Linea>(vacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setEstado('cargando');
    try {
      const data = await getJSON<Linea[]>(`${API}/Catalogos/lineas`);
      setItems(Array.isArray(data) ? data : []);
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  };

  useEffect(() => { void cargar(); }, []);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (l: Linea) => { setForm({ ...l }); setVista('form'); window.scrollTo(0, 0); };

  const set = <K extends keyof Linea>(k: K, v: Linea[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = (form.id ?? 0) > 0;
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      idLineaPadre: form.idLineaPadre ?? 0,
      esActiva: form.esActiva ?? true,
    };
    const payload = isEdit ? { id: form.id ?? 0, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', `${API}/Catalogos/lineas`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Línea actualizada.' : 'Línea creada.', 'success');
      await cargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="lineas">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Líneas</h1>
            </div>
            <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva línea</button>
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>Línea Padre</th><th>Activa</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={5} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((l) => (
                    <tr key={l.id}>
                      <td>{l.id}</td><td>{l.descripcion}</td><td>{l.idLineaPadre ?? '-'}</td><td>{siNo(l.esActiva)}</td>
                      <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(l)}><i className="bi bi-pencil" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{(form.id ?? 0) > 0 ? `Editar línea ${form.id}` : 'Nueva línea'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Id Línea Padre <small>(0 si es raíz)</small></label>
                  <input type="number" min={0} step={1} value={form.idLineaPadre ?? 0} onChange={(e) => set('idLineaPadre', num(e.target.value))} /></div>
                <label className="check-field"><input type="checkbox" checked={form.esActiva ?? true} onChange={(e) => set('esActiva', e.target.checked)} /> Activa</label>
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
