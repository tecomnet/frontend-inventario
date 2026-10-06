// Catálogo genérico de un solo campo "descripcion" (Marcas, Presentaciones,
// Unidades de Medida). Lista + formulario de alta/edición contra un endpoint
// que expone GET/POST/PUT sobre { id, descripcion }.
import { useState } from 'react';
import AppLayout from './AppLayout';
import Paginacion from './Paginacion';
import { useUI } from '../context/UIContext';
import { sendJSONStatus } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';

interface Item { id: number; descripcion?: string }

interface Props {
  active: string;
  titulo: string;
  singular: string;
  url: string;
}

export default function DescripcionCatalog({ active, titulo, singular, url }: Props) {
  const { notify } = useUI();
  const listado = useListadoPaginado<Item>(url);
  const { items, estado, errMsg } = listado;

  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [desc, setDesc] = useState('');
  const [guardando, setGuardando] = useState(false);

  const abrirAlta = () => { setEditingId(null); setDesc(''); setVista('form'); window.scrollTo(0, 0); };
  const abrirEdicion = (c: Item) => {
    setEditingId(c.id); setDesc(c.descripcion || ''); setVista('form'); window.scrollTo(0, 0);
  };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const d = desc.trim();
    if (!d) { notify(`La descripción es obligatoria.`); return; }
    const isEdit = editingId !== null;
    const payload = isEdit ? { id: editingId, descripcion: d } : { descripcion: d };
    setGuardando(true);
    try {
      const { ok, status } = await sendJSONStatus(isEdit ? 'PUT' : 'POST', url, payload);
      if (!ok) throw new Error('HTTP ' + status);
      notify(isEdit ? `${singular} actualizada.` : `${singular} creada.`, 'success');
      await listado.recargar();
      setVista('lista'); setEditingId(null);
    } catch (err) {
      notify('No se pudo guardar: ' + (err instanceof Error ? err.message : ''), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active={active}>
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Catálogo</span>
              <h1 className="page-title mb-0">{titulo}</h1>
            </div>
            <button className="btn btn-tec" onClick={abrirAlta}>
              <i className="bi bi-plus-lg" /> Nuevo
            </button>
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr><th>Id</th><th>Descripción</th><th className="text-end">Acciones</th></tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && (
                    <tr><td colSpan={3} className="text-center text-muted py-4">Cargando…</td></tr>
                  )}
                  {estado === 'error' && (
                    <tr><td colSpan={3} className="text-center text-danger py-4">No se pudo cargar ({errMsg}).</td></tr>
                  )}
                  {estado === 'ok' && items.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-muted py-4">Sin registros.</td></tr>
                  )}
                  {estado === 'ok' && items.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.descripcion}</td>
                      <td className="text-end">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(c)}>
                          <i className="bi bi-pencil" />
                        </button>
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
            etiqueta={titulo.toLowerCase()}
          />
        </>
      ) : (
        <>
          <h1 className="page-title fw-bold mb-4">
            {editingId === null ? `Nuevo ${singular.toLowerCase()}` : `Editar ${singular.toLowerCase()}`}
          </h1>
          <div className="form-card">
            <form onSubmit={guardar} noValidate>
              <div className="mb-0">
                <label className="form-label" htmlFor="fDesc">Descripción</label>
                <input type="text" className="form-control" id="fDesc"
                  value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
            </form>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary px-4" onClick={guardar} disabled={guardando}>Guardar</button>
            <button type="button" className="btn btn-secondary px-4"
              onClick={() => { setVista('lista'); setEditingId(null); }}>Cancelar</button>
          </div>
        </>
      )}
    </AppLayout>
  );
}
