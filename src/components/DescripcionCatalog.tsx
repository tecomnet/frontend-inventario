// Catálogo genérico de un solo campo "descripcion" (Marcas, Presentaciones,
// Unidades de Medida). Lista + formulario de alta/edición contra un endpoint
// que expone GET/POST sobre la URL y PUT sobre {url}/{id} con { id, descripcion }.
import { useState } from 'react';
import AppLayout from './AppLayout';
import CampoError from './CampoError';
import Paginacion from './Paginacion';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { usePermisos } from '../hooks/usePermisos';
import { sendJSON } from '../lib/api';
import type { CatalogoDescripcion, CreateDescripcion, UpdateDescripcion } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import ConfirmarBaja from './ConfirmarBaja';
const CAMPOS = ['descripcion'] as const;

interface Props {
  active: string;
  titulo: string;
  singular: string;
  url: string;
}

export default function DescripcionCatalog({ active, titulo, singular, url }: Props) {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const [ busqueda, setBusqueda ] = useState('');
  const [search, setSearch] = useState('');
  const listado = useListadoPaginado<CatalogoDescripcion>(url, { search });
  const { items, estado, errMsg } = listado;
  const [aBorrar, setABorrar] = useState<CatalogoDescripcion | null>(null);
  const [borrando, setBorrando] = useState(false);

  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [desc, setDesc] = useState('');
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirForm = (id: number | null, descripcion: string) => {
    setEditingId(id); setDesc(descripcion); errores.limpiar(); setVista('form'); window.scrollTo(0, 0);
  };
  const abrirAlta = () => abrirForm(null, '');
  const abrirEdicion = (c: CatalogoDescripcion) => abrirForm(c.id, c.descripcion);

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const d = desc.trim();
    if (!d) { notify(`La descripción es obligatoria.`); return; }
    const isEdit = editingId !== null;
    setGuardando(true);
    try {
      if (isEdit) await sendJSON('PUT', `${url}/${editingId}`, { id: editingId, descripcion: d } satisfies UpdateDescripcion);
      else await sendJSON('POST', url, { descripcion: d } satisfies CreateDescripcion);
      notify(isEdit ? `${singular} actualizada.` : `${singular} creada.`, 'success');
      await listado.recargar();
      setVista('lista'); setEditingId(null);
    } catch (err) {
      errores.capturar(err, `No se pudo guardar: ${singular.toLowerCase()}`);
    } finally {
      setGuardando(false);
    }
  };

    const buscar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSearch(busqueda.trim());
    listado.irA(1);
  };

  const confirmarBaja = async () => {
    if (!aBorrar) return;
    setBorrando(true);
    try {
      await sendJSON('DELETE', `${url}/${aBorrar.id}`);
      notify(`${singular} dada de baja.`, 'success');
      setABorrar(null);
      await listado.recargar();
    } catch (err) {
      notifyError(err, `No se pudo dar de baja: ${singular.toLowerCase()}`);
    } finally {
      setBorrando(false);
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
            {puedeEscribir && (
              <button className="btn btn-tec" onClick={abrirAlta}>
                <i className="bi bi-plus-lg" /> Nuevo
              </button>
            )}
          </div>

                      <form className="search-container" role="search" onSubmit={buscar}>
            <input type="search" placeholder="Buscar por descripción…" aria-label="Buscar"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Buscar</button>
          </form>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr><th>Id</th><th>Descripción</th>{puedeEscribir && <th className="text-end">Acciones</th>}</tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && (
                    <tr><td colSpan={3} className="text-center text-muted py-4">Cargando…</td></tr>
                  )}
                  {estado === 'error' && (
                    <tr><td colSpan={3} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>
                  )}
                  {estado === 'ok' && items.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-muted py-4">Sin registros.</td></tr>
                  )}
                  {estado === 'ok' && items.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.descripcion}</td>
                      {puedeEscribir && (
                        <td className="text-end">
                          <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(c)}>
                            <i className="bi bi-pencil" />
                          </button>
                                                    <button className="action-btn delete" title="Dar de baja" onClick={() => setABorrar(c)}>
                            <i className="bi bi-slash-circle" />
                          </button>
                        </td>
                      )}
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
                    <ConfirmarBaja
            mensaje={aBorrar ? `¿Dar de baja "${aBorrar.descripcion}"?` : null}
            procesando={borrando}
            onConfirmar={confirmarBaja}
            onCancelar={() => setABorrar(null)}
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
                <input type="text" className="form-control" id="fDesc" aria-invalid={!!errores.de('descripcion')}
                  value={desc} onChange={(e) => { setDesc(e.target.value); errores.limpiar('descripcion'); }} />
                <CampoError mensajes={errores.de('descripcion')} />
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
