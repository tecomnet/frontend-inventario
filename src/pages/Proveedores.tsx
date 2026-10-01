// Administración de Proveedores (alta, edición). Sin baja.
// Equivale a getProveedores / renderProveedorForm / guardarProveedor del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { API, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { usePermisos } from '../hooks/usePermisos';
import { siNo } from '../lib/format';

interface Proveedor {
  id: number;
  descripcion?: string;
  contacto?: string | null;
  diasCredito?: number | null;
  esActivo?: boolean;
}

const vacio: Proveedor = { id: 0, descripcion: '', contacto: '', diasCredito: 0, esActivo: true };

export default function Proveedores() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Proveedor>(`${API}/Catalogos/proveedores`);
  const { items, estado } = listado;
  const { puedeEscribir } = usePermisos();
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Proveedor>(vacio);
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (p: Proveedor) => { setForm({ ...p }); setVista('form'); window.scrollTo(0, 0); };

  const set = <K extends keyof Proveedor>(k: K, v: Proveedor[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = (form.id ?? 0) > 0;
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      // Opcionales en la API: vacío viaja como null para no convertir un null
      // guardado en '' o 0 al editar (el PUT reemplaza el registro completo).
      contacto: (form.contacto ?? '').trim() || null,
      diasCredito: form.diasCredito ?? null,
      esActivo: form.esActivo ?? true,
    };
    const payload = isEdit ? { id: form.id ?? 0, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', isEdit ? `${API}/Catalogos/proveedores/${form.id}` : `${API}/Catalogos/proveedores`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Proveedor actualizado.' : 'Proveedor creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="proveedores">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Proveedores</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nuevo proveedor</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>Contacto</th><th>Días Crédito</th><th>Activo</th>
                    {puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={6} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={6} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.descripcion}</td><td>{p.contacto ?? '-'}</td>
                      <td>{p.diasCredito ?? 0}</td><td>{siNo(p.esActivo)}</td>
                      {puedeEscribir && <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(p)}><i className="bi bi-pencil" /></button>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Paginacion
            page={listado.page} pageSize={listado.pageSize}
            totalRecords={listado.totalRecords} totalPages={listado.totalPages}
            onPage={listado.irA} onPageSize={listado.cambiarPageSize}
            etiqueta="proveedores"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{(form.id ?? 0) > 0 ? `Editar proveedor ${form.id}` : 'Nuevo proveedor'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Contacto</label>
                  <input type="text" value={form.contacto ?? ''} onChange={(e) => set('contacto', e.target.value)} /></div>
                <div className="form-group"><label>Días Crédito</label>
                  <input type="number" min={0} step={1} value={form.diasCredito ?? ''} onChange={(e) => set('diasCredito', e.target.value === '' ? null : num(e.target.value))} /></div>
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
