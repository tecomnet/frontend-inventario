// Administración de Almacenes (alta, edición, baja).
// Equivale a getAlmacenes / renderAlmacenForm / guardarAlmacen / bajaAlmacen del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { Almacen, CreateAlmacen, UpdateAlmacen } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

// La API lista con id/empresaId/udnId y el PUT recibe idAlmacen/idEmpresa/idUdn:
// el formulario trabaja con los nombres del PUT.
const vacio: UpdateAlmacen = { idAlmacen: 0, descripcion: '', tipo: '', idEmpresa: 0, idUdn: 0, esActivo: true };
const CAMPOS = ['descripcion', 'tipo', 'idEmpresa', 'idUdn'] as const;

const aForm = (a: Almacen): UpdateAlmacen => ({
  idAlmacen: a.id, idEmpresa: a.empresaId, idUdn: a.udnId,
  descripcion: a.descripcion, tipo: a.tipo, esActivo: a.esActivo,
});

/**
 * El almacén no tiene un solo id: su llave es empresa + udn + almacén.
 * Ojo con el orden: la API lo pide como {empresaId}/{udnId}/{almacenId}.
 * Devuelve null si falta alguna parte (no se puede editar ni borrar).
 */
const rutaDe = ({ idEmpresa, idUdn, idAlmacen }: UpdateAlmacen): string | null => {
  if (!idEmpresa || !idUdn || !idAlmacen) return null;
  return `${API}/Catalogos/almacenes/${idEmpresa}/${idUdn}/${idAlmacen}`;
};

export default function Almacenes() {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<Almacen>(`${API}/Catalogos/almacenes`);
  const { items, estado, errMsg } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<UpdateAlmacen>(vacio);
  // Alta o edición se decide por esto y no por idAlmacen > 0, para que editar
  // un almacén sin llave completa nunca termine creando otro.
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (f: UpdateAlmacen, edicion: boolean) => {
    setForm(f); setEditando(edicion); errores.limpiar();
    setVista('form'); window.scrollTo(0, 0);
  };
  const abrirAlta = () => abrirForm(vacio, false);
  const abrirEdicion = (f: UpdateAlmacen) => abrirForm(f, true);

  const set = <K extends keyof UpdateAlmacen>(k: K, v: UpdateAlmacen[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };
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
      descripcion: form.descripcion.trim(),
      tipo: form.tipo.trim(),
      idEmpresa: form.idEmpresa,
      idUdn: form.idUdn,
      esActivo: form.esActivo ?? true,
    } satisfies CreateAlmacen;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', ruta, { idAlmacen: form.idAlmacen, ...base } satisfies UpdateAlmacen);
      else await sendJSON('POST', ruta, base);
      notify(isEdit ? 'Almacén actualizado.' : 'Almacén creado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar el almacén');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (a: UpdateAlmacen) => {
    const ruta = rutaDe(a);
    if (!ruta) {
      notify('No se puede dar de baja: el API no devolvió la llave completa del almacén.', 'danger');
      return;
    }
    if (!window.confirm(`¿Dar de baja el almacén ${a.idAlmacen} (${a.descripcion})?`)) return;
    try {
      await sendJSON('DELETE', ruta);
      notify('Almacén dado de baja.', 'success');
      await listado.recargar();
    } catch (err) {
      notifyError(err, 'No se pudo dar de baja el almacén');
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
                  {estado === 'error' && <tr><td colSpan={7} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((raw, i) => {
                    const a = aForm(raw);
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
                  <input aria-invalid={!!errores.de('descripcion')} type="text" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} required />
                  <CampoError mensajes={errores.de('descripcion')} /></div>
                <div className="form-group"><label>Tipo</label>
                  <input aria-invalid={!!errores.de('tipo')} type="text" value={form.tipo} onChange={(e) => set('tipo', e.target.value)} required />
                  <CampoError mensajes={errores.de('tipo')} /></div>
                <div className="form-group"><label>Empresa Id</label>
                  <input aria-invalid={!!errores.de('idEmpresa')} type="number" min={1} step={1} value={form.idEmpresa} onChange={(e) => set('idEmpresa', num(e.target.value))} disabled={editando} required />
                  <CampoError mensajes={errores.de('idEmpresa')} /></div>
                <div className="form-group"><label>UDN Id</label>
                  <input aria-invalid={!!errores.de('idUdn')} type="number" min={1} step={1} value={form.idUdn} onChange={(e) => set('idUdn', num(e.target.value))} disabled={editando} required />
                  <CampoError mensajes={errores.de('idUdn')} /></div>
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
