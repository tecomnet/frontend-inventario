// Administración de Productos (alta, edición, baja).
// Equivale a getProductos / renderProductoForm / bajaProducto del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateProducto, Producto, UpdateProducto } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

/** Formulario = cuerpo del PUT; id 0 es alta. */
const vacio: UpdateProducto = {
  id: 0, codInterno: '', descripcion: '', marcaId: 0, lineaId: 0,
  presentacionId: 0, unidadMedidaId: 0, materialId: 0, iva: 0, ieps: 0, esActivo: true,
};
const CAMPOS = [
  'codInterno', 'descripcion', 'marcaId', 'lineaId', 'presentacionId',
  'unidadMedidaId', 'materialId', 'iva', 'ieps',
] as const;

export default function Productos() {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<Producto>(`${API}/Productos`);
  const { items, estado, errMsg } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateProducto>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateProducto) => { setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0); };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (p: Producto) => abrirForm({
    id: p.id, codInterno: p.codInterno, descripcion: p.descripcion,
    marcaId: p.marcaId, lineaId: p.lineaId, presentacionId: p.presentacioniD,
    unidadMedidaId: p.unidadMedidaId, materialId: p.materialId,
    iva: p.iva, ieps: p.ieps, esActivo: p.esActivo,
  });

  const set = <K extends keyof UpdateProducto>(k: K, v: UpdateProducto[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = form.id > 0;
    const base = {
      codInterno: form.codInterno.trim(),
      descripcion: form.descripcion.trim(),
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
    } satisfies CreateProducto;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${API}/Productos/${form.id}`, { id: form.id, ...base } satisfies UpdateProducto);
      else await sendJSON('POST', `${API}/Productos`, base);
      notify(isEdit ? 'Producto actualizado.' : 'Producto creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (id: number) => {
    if (!window.confirm(`¿Dar de baja el producto ${id}?`)) return;
    try {
      await sendJSON('DELETE', `${API}/Productos/${id}`);
      notify('Producto dado de baja.', 'success');
      await listado.recargar();
    } catch (err) {
      notifyError(err, 'No se pudo dar de baja el producto');
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
                  {estado === 'error' && <tr><td colSpan={10} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
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
          <h1 className="page-title fw-bold mb-4">{form.id > 0 ? `Editar producto ${form.id}` : 'Nuevo producto'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Código interno</label>
                  <input aria-invalid={!!errores.de('codInterno')} type="text" value={form.codInterno} onChange={(e) => set('codInterno', e.target.value)} required />
                  <CampoError mensajes={errores.de('codInterno')} /></div>
                <div className="form-group"><label>Descripción</label>
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>Marca Id</label>
                  <input aria-invalid={!!errores.de('marcaId')} type="number" min={0} step={1} value={form.marcaId ?? 0} onChange={(e) => set('marcaId', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('marcaId')} /></div>
                <div className="form-group"><label>Línea Id</label>
                  <input aria-invalid={!!errores.de('lineaId')} type="number" min={0} step={1} value={form.lineaId ?? 0} onChange={(e) => set('lineaId', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('lineaId')} /></div>
                <div className="form-group"><label>Presentación Id</label>
                  <input aria-invalid={!!errores.de('presentacionId')} type="number" min={0} step={1} value={form.presentacionId ?? 0} onChange={(e) => set('presentacionId', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('presentacionId')} /></div>
                <div className="form-group"><label>Unidad Medida Id</label>
                  <input aria-invalid={!!errores.de('unidadMedidaId')} type="number" min={0} step={1} value={form.unidadMedidaId ?? 0} onChange={(e) => set('unidadMedidaId', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('unidadMedidaId')} /></div>
                <div className="form-group"><label>Material Id</label>
                  <input aria-invalid={!!errores.de('materialId')} type="number" min={0} step={1} value={form.materialId ?? 0} onChange={(e) => set('materialId', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('materialId')} /></div>
                <div className="form-group"><label>IVA</label>
                  <input aria-invalid={!!errores.de('iva')} type="number" min={0} step={0.01} value={form.iva ?? 0} onChange={(e) => set('iva', Number(e.target.value))} required />
                  <CampoError mensajes={errores.de('iva')} /></div>
                <div className="form-group"><label>IEPS</label>
                  <input aria-invalid={!!errores.de('ieps')} type="number" min={0} step={0.01} value={form.ieps ?? 0} onChange={(e) => set('ieps', Number(e.target.value))} required />
                  <CampoError mensajes={errores.de('ieps')} /></div>
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
