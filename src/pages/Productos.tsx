// Administración de Productos (alta, edición, baja).
// Equivale a getProductos / renderProductoForm / bajaProducto del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { API, avisoSinPermiso, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { usePermisos } from '../hooks/usePermisos';
import { siNo } from '../lib/format';

interface Producto {
  id: number;
  codInterno?: string;
  descripcion?: string;
  materialDescripcion?: string;
  presentacionDescripcion?: string;
  lineaDescripcion?: string;
  marcaId?: number;
  lineaId?: number;
  presentacionId?: number;
  presentacioniD?: number;
  unidadMedidaId?: number;
  materialId?: number;
  iva?: number;
  ieps?: number;
  esActivo?: boolean;
}

const vacio: Producto = {
  id: 0, codInterno: '', descripcion: '', marcaId: 0, lineaId: 0,
  presentacionId: 0, unidadMedidaId: 0, materialId: 0, iva: 0, ieps: 0, esActivo: true,
};

export default function Productos() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Producto>(`${API}/Productos`);
  const { items, estado } = listado;
  const { puedeEscribir } = usePermisos();
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Producto>(vacio);
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (p: Producto) => {
    setForm({ ...p, presentacionId: p.presentacionId ?? p.presentacioniD ?? 0 });
    setVista('form'); window.scrollTo(0, 0);
  };

  const set = <K extends keyof Producto>(k: K, v: Producto[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = (form.id ?? 0) > 0;
    const payload = {
      id: form.id ?? 0,
      codInterno: (form.codInterno ?? '').trim(),
      descripcion: (form.descripcion ?? '').trim(),
      // Opcionales en la API: el listado trae 0 cuando no hay valor, y 0 no
      // es un id válido; viaja como null para no romper la llave al editar.
      marcaId: form.marcaId || null,
      lineaId: form.lineaId || null,
      presentacionId: form.presentacionId || null,
      unidadMedidaId: form.unidadMedidaId || null,
      materialId: form.materialId || null,
      iva: form.iva ?? 0,
      ieps: form.ieps ?? 0,
      esActivo: form.esActivo ?? true,
    };
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', isEdit ? `${API}/Productos/${payload.id}` : `${API}/Productos`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Producto actualizado.' : 'Producto creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (id: number) => {
    if (!window.confirm(`¿Dar de baja el producto ${id}?`)) return;
    try {
      const { ok, status, data } = await sendJSONStatus('DELETE', `${API}/Productos/${id}`);
      const aviso = avisoSinPermiso(status, data);
      if (aviso) { notify(aviso, 'warning'); return; }
      if (!ok) throw new Error('HTTP ' + status);
      notify('Producto dado de baja.', 'success');
      await listado.recargar();
    } catch {
      notify('No se pudo dar de baja el producto. Revisa el API.', 'danger');
    }
  };

  return (
    <AppLayout active="productos">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Productos</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nuevo producto</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Código</th><th>Nombre</th><th>Material</th><th>Tipo</th>
                    <th>Línea</th><th>IVA</th><th>IEPS</th><th>Activo</th>{puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={10} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={10} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={10} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.codInterno ?? '-'}</td><td>{p.descripcion}</td>
                      <td>{p.materialDescripcion}</td><td>{p.presentacionDescripcion}</td><td>{p.lineaDescripcion}</td>
                      <td>{p.iva}</td><td>{p.ieps}</td><td>{siNo(p.esActivo)}</td>
                      {puedeEscribir && <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(p)}><i className="bi bi-pencil" /></button>
                        <button className="action-btn disable" title="Dar de baja" onClick={() => baja(p.id)}><i className="bi bi-slash-circle" /></button>
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
            etiqueta="productos"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{(form.id ?? 0) > 0 ? `Editar producto ${form.id}` : 'Nuevo producto'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Código interno</label>
                  <input type="text" value={form.codInterno ?? ''} onChange={(e) => set('codInterno', e.target.value)} required /></div>
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Marca Id</label>
                  <input type="number" min={0} step={1} value={form.marcaId ?? 0} onChange={(e) => set('marcaId', num(e.target.value))} required /></div>
                <div className="form-group"><label>Línea Id</label>
                  <input type="number" min={0} step={1} value={form.lineaId ?? 0} onChange={(e) => set('lineaId', num(e.target.value))} required /></div>
                <div className="form-group"><label>Presentación Id</label>
                  <input type="number" min={0} step={1} value={form.presentacionId ?? 0} onChange={(e) => set('presentacionId', num(e.target.value))} required /></div>
                <div className="form-group"><label>Unidad Medida Id</label>
                  <input type="number" min={0} step={1} value={form.unidadMedidaId ?? 0} onChange={(e) => set('unidadMedidaId', num(e.target.value))} required /></div>
                <div className="form-group"><label>Material Id</label>
                  <input type="number" min={0} step={1} value={form.materialId ?? 0} onChange={(e) => set('materialId', num(e.target.value))} required /></div>
                <div className="form-group"><label>IVA</label>
                  <input type="number" min={0} step={0.01} value={form.iva ?? 0} onChange={(e) => set('iva', Number(e.target.value))} required /></div>
                <div className="form-group"><label>IEPS</label>
                  <input type="number" min={0} step={0.01} value={form.ieps ?? 0} onChange={(e) => set('ieps', Number(e.target.value))} required /></div>
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
