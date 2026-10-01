// Administración de Unidades de Negocio (alta, edición, baja).
// Equivale a getUnidadesNegocio / renderUdnForm / guardarUdn / bajaUdn del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { usePermisos } from '../hooks/usePermisos';
import { API, avisoSinPermiso, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

// La API lista con id/empresaId y el PUT recibe idUdn/idEmpresa; el
// formulario trabaja con los nombres del PUT y acepta los dos al leer.
interface Udn {
  idUdn: number;
  id?: number;
  descripcion?: string;
  idEmpresa?: number;
  empresaId?: number;
  esActiva?: boolean;
}

const empresaDe = (u: Udn) => u.idEmpresa ?? u.empresaId ?? 0;

const vacio: Udn = { idUdn: 0, descripcion: '', idEmpresa: 0, esActiva: true };

export default function UnidadesNegocio() {
  const { notify } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<Udn>(`${API}/Catalogos/unidadesnegocio`);
  const { items, estado } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Udn>(vacio);
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (u: Udn) => {
    setForm({ ...u, idUdn: u.idUdn ?? u.id ?? 0, idEmpresa: empresaDe(u) });
    setVista('form'); window.scrollTo(0, 0);
  };

  const set = <K extends keyof Udn>(k: K, v: Udn[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => Number(v) || 0;

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const idUdn = form.idUdn ?? 0;
    const isEdit = idUdn > 0;
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      idEmpresa: form.idEmpresa ?? 0,
      esActiva: form.esActiva ?? true,
    };
    const payload = isEdit ? { idUdn, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', isEdit ? `${API}/Catalogos/unidadesnegocio/${idUdn}` : `${API}/Catalogos/unidadesnegocio`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'UDN actualizada.' : 'UDN creada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const baja = async (idUdn: number) => {
    if (!window.confirm(`¿Dar de baja la UDN ${idUdn}?`)) return;
    try {
      const { ok, status, data } = await sendJSONStatus('DELETE', `${API}/Catalogos/unidadesnegocio/${idUdn}`);
      const aviso = avisoSinPermiso(status, data);
      if (aviso) { notify(aviso, 'warning'); return; }
      if (!ok) throw new Error('HTTP ' + status);
      notify('UDN dada de baja.', 'success');
      await listado.recargar();
    } catch {
      notify('No se pudo dar de baja la UDN. Revisa el API.', 'danger');
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
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((u) => {
                    const id = u.idUdn ?? u.id ?? 0;
                    return (
                      <tr key={id}>
                        <td>{id}</td><td>{u.descripcion}</td><td>{empresaDe(u)}</td><td>{siNo(u.esActiva)}</td>
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
          <h1 className="page-title fw-bold mb-4">{(form.idUdn ?? 0) > 0 ? `Editar UDN ${form.idUdn}` : 'Nueva UDN'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>Empresa Id</label>
                  <input type="number" min={1} step={1} value={form.idEmpresa ?? 0} onChange={(e) => set('idEmpresa', num(e.target.value))} required /></div>
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
