// Administración de Proveedores (alta, edición). Sin baja.
// Equivale a getProveedores / renderProveedorForm / guardarProveedor del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateProveedor, Proveedor, UpdateProveedor } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

/** Formulario = cuerpo del PUT; id 0 es alta. */
const vacio: UpdateProveedor = { id: 0, descripcion: '', contacto: '', diasCredito: 0, esActivo: true };
const CAMPOS = ['descripcion', 'contacto', 'diasCredito'] as const;

export default function Proveedores() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Proveedor>(`${API}/Catalogos/proveedores`);
  const { items, estado, errMsg } = listado;
  const { puedeEscribir } = usePermisos();
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateProveedor>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateProveedor) => { setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0); };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (p: Proveedor) => abrirForm({
    id: p.id, descripcion: p.descripcion, contacto: p.contacto, diasCredito: p.diasCredito, esActivo: p.esActivo,
  });

  const set = <K extends keyof UpdateProveedor>(k: K, v: UpdateProveedor[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = form.id > 0;
    const base = {
      descripcion: form.descripcion.trim(),
      // Opcionales en la API: vacío viaja como null para no convertir un null
      // guardado en '' o 0 al editar (el PUT reemplaza el registro completo).
      contacto: (form.contacto ?? '').trim() || null,
      diasCredito: form.diasCredito ?? null,
      esActivo: form.esActivo ?? true,
    } satisfies CreateProveedor;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${API}/Catalogos/proveedores/${form.id}`, { id: form.id, ...base } satisfies UpdateProveedor);
      else await sendJSON('POST', `${API}/Catalogos/proveedores`, base);
      notify(isEdit ? 'Proveedor actualizado.' : 'Proveedor creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar el proveedor');
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
                  {estado === 'error' && <tr><td colSpan={6} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
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
          <h1 className="page-title fw-bold mb-4">{form.id > 0 ? `Editar proveedor ${form.id}` : 'Nuevo proveedor'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>Contacto</label>
                  <input aria-invalid={!!errores.de('contacto')} type="text" value={form.contacto ?? ''} onChange={(e) => set('contacto', e.target.value)} />
                  <CampoError mensajes={errores.de('contacto')} /></div>
                <div className="form-group"><label>Días Crédito</label>
                  <input aria-invalid={!!errores.de('diasCredito')} type="number" min={0} step={1} value={form.diasCredito ?? ''} onChange={(e) => set('diasCredito', e.target.value === '' ? null : num(e.target.value))} />
                  <CampoError mensajes={errores.de('diasCredito')} /></div>
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
