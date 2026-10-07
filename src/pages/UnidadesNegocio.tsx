// Administración de Unidades de Negocio (alta, edición, baja).
// Equivale a getUnidadesNegocio / renderUdnForm / guardarUdn / bajaUdn del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateUnidadNegocio, UnidadNegocio, UpdateUnidadNegocio } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

// La API lista con id/empresaId y el PUT recibe idUdn/idEmpresa: el formulario
// trabaja con los nombres del PUT (idUdn 0 es alta).
const vacio: UpdateUnidadNegocio = { idUdn: 0, descripcion: '', idEmpresa: 0, esActiva: true };
const CAMPOS = ['descripcion', 'idEmpresa'] as const;

export default function UnidadesNegocio() {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<UnidadNegocio>(`${API}/Catalogos/unidadesnegocio`);
  const { items, estado, errMsg } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateUnidadNegocio>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateUnidadNegocio) => { setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0); };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (u: UnidadNegocio) => abrirForm({
    idUdn: u.id, descripcion: u.descripcion, idEmpresa: u.empresaId, esActiva: u.esActiva,
  });

  const set = <K extends keyof UpdateUnidadNegocio>(k: K, v: UpdateUnidadNegocio[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const { idUdn } = form;
    const isEdit = idUdn > 0;
    const base = {
      descripcion: form.descripcion.trim(),
      idEmpresa: form.idEmpresa ?? 0,
      esActiva: form.esActiva ?? true,
    } satisfies CreateUnidadNegocio;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${API}/Catalogos/unidadesnegocio/${idUdn}`, { idUdn, ...base } satisfies UpdateUnidadNegocio);
      else await sendJSON('POST', `${API}/Catalogos/unidadesnegocio`, base);
      notify(isEdit ? 'UDN actualizada.' : 'UDN creada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la UDN');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (idUdn: number) => {
    if (!window.confirm(`¿Dar de baja la UDN ${idUdn}?`)) return;
    try {
      await sendJSON('DELETE', `${API}/Catalogos/unidadesnegocio/${idUdn}`);
      notify('UDN dada de baja.', 'success');
      await listado.recargar();
    } catch (err) {
      notifyError(err, 'No se pudo dar de baja la UDN');
    }
  };

  return (
    <AppLayout active="unidades-negocio">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">Unidades de Negocio</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva UDN</button>}
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>Empresa Id</th><th>Activa</th>{puedeEscribir && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={5} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((u) => {
                    const { id } = u;
                    return (
                      <tr key={id}>
                        <td>{id}</td><td>{u.descripcion}</td><td>{u.empresaId}</td><td>{siNo(u.esActiva)}</td>
                        {puedeEscribir && <td className="text-end">
                          <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(u)}><i className="bi bi-pencil" /></button>
                          <button className="action-btn disable" title="Dar de baja" onClick={() => baja(id)}><i className="bi bi-slash-circle" /></button>
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
            etiqueta="unidades de negocio"
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">{form.idUdn > 0 ? `Editar UDN ${form.idUdn}` : 'Nueva UDN'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>Empresa Id</label>
                  <input aria-invalid={!!errores.de('idEmpresa')} type="number" min={1} step={1} value={form.idEmpresa ?? 0} onChange={(e) => set('idEmpresa', num(e.target.value))} required />
                  <CampoError mensajes={errores.de('idEmpresa')} /></div>
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
