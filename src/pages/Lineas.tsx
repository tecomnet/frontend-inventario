// Administración de Líneas (alta, edición). Sin baja.
// Equivale a getLineas / renderLineaForm / guardarLinea del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateLinea, Linea, UpdateLinea } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

/** Formulario = cuerpo del PUT; id 0 es alta. */
const vacio: UpdateLinea = { id: 0, descripcion: '', idLineaPadre: 0, esActiva: true };
const CAMPOS = ['descripcion', 'idLineaPadre'] as const;

export default function Lineas() {
  const { notify } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<Linea>(`${API}/Catalogos/lineas`);
  const { items, estado, errMsg } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateLinea>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateLinea) => { setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0); };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (l: Linea) => abrirForm({
    id: l.id, descripcion: l.descripcion, idLineaPadre: l.idLineaPadre ?? 0, esActiva: l.esActiva,
  });

  const set = <K extends keyof UpdateLinea>(k: K, v: UpdateLinea[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = form.id > 0;
    const base = {
      descripcion: form.descripcion.trim(),
      idLineaPadre: form.idLineaPadre,
      esActiva: form.esActiva,
    } satisfies CreateLinea;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${API}/Catalogos/lineas/${form.id}`, { id: form.id, ...base } satisfies UpdateLinea);
      else await sendJSON('POST', `${API}/Catalogos/lineas`, base);
      notify(isEdit ? 'Línea actualizada.' : 'Línea creada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la línea');
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
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva línea</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>Línea Padre</th><th>Activa</th>
                    {puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={5} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((l) => (
                    <tr key={l.id}>
                      <td>{l.id}</td><td>{l.descripcion}</td><td>{l.idLineaPadre ?? '-'}</td><td>{siNo(l.esActiva)}</td>
                      {puedeEscribir && <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(l)}><i className="bi bi-pencil" /></button>
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
            etiqueta="líneas"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{form.id > 0 ? `Editar línea ${form.id}` : 'Nueva línea'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>Id Línea Padre <small>(0 si es raíz)</small></label>
                  <input aria-invalid={!!errores.de('idLineaPadre')} type="number" min={0} step={1} value={form.idLineaPadre} onChange={(e) => set('idLineaPadre', num(e.target.value))} />
                  <CampoError mensajes={errores.de('idLineaPadre')} /></div>
                <label className="check-field"><input type="checkbox" checked={form.esActiva} onChange={(e) => set('esActiva', e.target.checked)} /> Activa</label>
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
