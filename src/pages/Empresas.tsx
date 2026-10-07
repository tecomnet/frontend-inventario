// Administración de Empresas (alta, edición).
// Equivale a getEmpresas / renderEmpresaForm / guardarEmpresa del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { useUI } from '../context/UIContext';
import { API, sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { siNo } from '../lib/format';

interface Empresa {
  id: number;
  descripcion?: string;
  rfc?: string;
  esActiva?: boolean;
}

const vacio: Empresa = { id: 0, descripcion: '', rfc: '', esActiva: true };

export default function Empresas() {
  const { notify } = useUI();
  const listado = useListadoPaginado<Empresa>(`${API}/Catalogos/empresas`);
  const { items, estado } = listado;
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<Empresa>(vacio);
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setForm(vacio); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (e: Empresa) => { setForm({ ...e }); setVista('form'); window.scrollTo(0, 0); };

  const set = <K extends keyof Empresa>(k: K, v: Empresa[K]) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const isEdit = (form.id ?? 0) > 0;
    const base = {
      descripcion: (form.descripcion ?? '').trim(),
      rfc: (form.rfc ?? '').trim(),
      esActiva: form.esActiva ?? true,
    };
    const payload = isEdit ? { id: form.id ?? 0, ...base } : base;
    setGuardando(true);
    try {
      const { ok, status, data } = await sendJSONStatus<{ errors?: Record<string, string[]>; title?: string; message?: string }>(
        isEdit ? 'PUT' : 'POST', isEdit ? `${API}/Catalogos/empresas/${form.id}` : `${API}/Catalogos/empresas`, payload,
      );
      if (!ok) {
        const lines = data?.errors ? Object.values(data.errors).flat() : [data?.title || data?.message || `HTTP ${status}`];
        notify('No se pudo guardar:\n' + lines.map((l) => `• ${l}`).join('\n'), 'danger');
        return;
      }
      notify(isEdit ? 'Empresa actualizada.' : 'Empresa creada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      notify('Error de red: ' + (err instanceof Error ? err.message : ''), 'danger');
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
            <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva empresa</button>
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Id</th><th>Descripción</th><th>RFC</th><th>Activa</th><th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && <tr><td colSpan={5} className="text-center text-muted py-4">Cargando…</td></tr>}
                  {estado === 'error' && <tr><td colSpan={5} className="text-center text-danger py-4">No se pudo cargar.</td></tr>}
                  {estado === 'ok' && items.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Sin registros.</td></tr>}
                  {estado === 'ok' && items.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td><td>{e.descripcion}</td><td>{e.rfc}</td><td>{siNo(e.esActiva)}</td>
                      <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(e)}><i className="bi bi-pencil" /></button>
                      </td>
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
          <h1 className="page-title fw-bold mb-4">{(form.id ?? 0) > 0 ? `Editar empresa ${form.id}` : 'Nueva empresa'}</h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="entity-grid">
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} required /></div>
                <div className="form-group"><label>RFC</label>
                  <input type="text" value={form.rfc ?? ''} onChange={(e) => set('rfc', e.target.value)} required /></div>
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
