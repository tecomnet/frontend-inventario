// Administración de Empresas (alta, edición).
// Equivale a getEmpresas / renderEmpresaForm / guardarEmpresa del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateEmpresa, Empresa, UpdateEmpresa } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

/** Formulario = cuerpo del PUT; id 0 es alta. */
const vacio: UpdateEmpresa = { id: 0, descripcion: '', rfc: '', esActiva: true };
const CAMPOS = ['descripcion', 'rfc'] as const;

export default function Empresas() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Empresa>(`${API}/Catalogos/empresas`);
  const { items, estado, errMsg } = listado;
  const { puedeEscribir } = usePermisos();
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateEmpresa>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateEmpresa) => { setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0); };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (e: Empresa) =>
    abrirForm({ id: e.id, descripcion: e.descripcion, rfc: e.rfc, esActiva: e.esActiva });

  const set = <K extends keyof UpdateEmpresa>(k: K, v: UpdateEmpresa[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = form.id > 0;
    const base = {
      descripcion: form.descripcion.trim(),
      rfc: form.rfc.trim(),
      esActiva: form.esActiva ?? true,
    } satisfies CreateEmpresa;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${API}/Catalogos/empresas/${form.id}`, { id: form.id, ...base } satisfies UpdateEmpresa);
      else await sendJSON('POST', `${API}/Catalogos/empresas`, base);
      notify(isEdit ? 'Empresa actualizada.' : 'Empresa creada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la empresa');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="empresas">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Empresas</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva empresa</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>RFC</th><th>Activa</th>{puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={5} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td><td>{e.descripcion}</td><td>{e.rfc}</td><td>{siNo(e.esActiva)}</td>
                      {puedeEscribir && <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(e)}><i className="bi bi-pencil" /></button>
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
            etiqueta="empresas"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{form.id > 0 ? `Editar empresa ${form.id}` : 'Nueva empresa'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>RFC</label>
                  <input aria-invalid={!!errores.de('rfc')} type="text" value={form.rfc} onChange={(e) => set('rfc', e.target.value)} required />
                  <CampoError mensajes={errores.de('rfc')} /></div>
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
