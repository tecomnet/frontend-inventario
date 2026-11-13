// Recepciones de mercancía: lista paginada con filtros de empresa y UDN.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { SelectCatalogo } from '../components/SelectCatalogo';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { nombreDe, useCatalogo } from '../hooks/useCatalogo';
import { usePermisos } from '../hooks/usePermisos';
import { API, getJSON, sendJSON } from '../lib/api';
import type { CreateRecepcion, CreateRecepcionDetalle, Recepcion, UpdateRecepcion } from '../lib/api-types';
import { fecha, isoToInput } from '../lib/format';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';


/** Un renglón del formulario: producto todavía sin elegir = null. */
interface Renglon {
  productoId: number | null;
  cantidad: number;
  cantidadPieza: number;
}

/** Formulario de alta/edición; id 0 es alta. */
interface FormRecepcion {
  id: number;
  empresaId: number | null;
  udnId: number | null;
  fechaRecepcion: string;
  referenciaCompra: string;
  estadoId: number | null;
  almacenId: number | null;
  detalles: Renglon[];
}

const renglonVacio: Renglon = { productoId: null, cantidad: 0, cantidadPieza: 0 };
const vacio: FormRecepcion = {
  id: 0, empresaId: null, udnId: null, fechaRecepcion: '', referenciaCompra: '',
  estadoId: null, almacenId: null, detalles: [renglonVacio],
};
const CAMPOS = ['empresaId', 'udnId', 'fechaRecepcion', 'referenciaCompra', 'almacenId', 'detalles'] as const;


export default function Recepciones() {
const { notify, notifyError } = useUI();
const { puedeEscribir } = usePermisos();
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number | null>(null);
  // Filtros aplicados al pulsar Filtrar; vacíos no se mandan.
  const [aplicados, setAplicados] = useState<Filtros>({});
  const listado = useListadoPaginado<Recepcion>(`${API}/Recepciones`, aplicados);
  const { items, estado, errMsg } = listado;
  const empresas = useCatalogo('empresas');
  const udns = useCatalogo('udn');

  const productos = useCatalogo('productos');
const [vista, setVista] = useState<'lista' | 'detalle' | 'form'>('lista');
  const [detalle, setDetalle] = useState<Recepcion | null>(null);
  const [form, setForm] = useState<FormRecepcion>(vacio);
const [guardando, setGuardando] = useState(false);
const errores = useErroresForm(CAMPOS);


  const filtrar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ empresaId, udnId });
    listado.irA(1);
  };

  
  const verDetalle = async (id: number) => {
    try {
      setDetalle(await getJSON<Recepcion>(`${API}/Recepciones/buscar?id=${id}`));
      setVista('detalle');
      window.scrollTo(0, 0);
    } catch (err) {
      notifyError(err, 'No se pudo cargar la recepción');
    }
  };

  
  const abrirForm = (f: FormRecepcion) => {
    setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0);
  };
  const abrirAlta = () => abrirForm(vacio);
    // Se pide la recepción completa para editar con todos sus renglones.
  const abrirEdicion = async (id: number) => {
    try {
      const r = await getJSON<Recepcion>(`${API}/Recepciones/buscar?id=${id}`);
      abrirForm({
        id: r.id, empresaId: r.empresaId, udnId: r.udnId,
        fechaRecepcion: isoToInput(r.fechaRecepcion), referenciaCompra: r.referenciaCompra,
        estadoId: r.estadoId, almacenId: null,
        detalles: r.recepcionDet.map((d) => ({ productoId: d.productoId, cantidad: d.cantidad, cantidadPieza: d.cantidadPieza })),
      });
    } catch (err) {
      notifyError(err, 'No se pudo cargar la recepción');
    }
  };

  const set = <K extends keyof FormRecepcion>(k: K, v: FormRecepcion[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };

  // Renglones: agregar uno vacío, quitar el i, o cambiar solo un campo del i.
  const agregarRenglon = () => setForm((f) => ({ ...f, detalles: [...f.detalles, renglonVacio] }));
  const quitarRenglon = (i: number) => setForm((f) => ({ ...f, detalles: f.detalles.filter((_, j) => j !== i) }));
  const cambiarRenglon = (i: number, cambios: Partial<Renglon>) => {
    setForm((f) => ({ ...f, detalles: f.detalles.map((r, j) => (j === i ? { ...r, ...cambios } : r)) }));
    errores.limpiar('detalles');
  };

  const guardar = async () => {
    const isEdit = form.id > 0;
    // Los renglones sin producto no se mandan.
    const detalles: CreateRecepcionDetalle[] = form.detalles.flatMap((r) =>
      r.productoId ? [{ productoId: r.productoId, cantidad: r.cantidad, cantidadPieza: r.cantidadPieza }] : []);
    setGuardando(true);
    try {
      if (isEdit) {
        await sendJSON('PUT', `${API}/Recepciones/${form.id}`, {
          id: form.id,
          fechaRecepcion: form.fechaRecepcion || null,
          referenciaCompra: form.referenciaCompra.trim(),
          estadoId: form.estadoId,
          almacenId: form.almacenId,
          detalles,
        } satisfies UpdateRecepcion);
      } else {
        await sendJSON('POST', `${API}/Recepciones`, {
          empresaId: form.empresaId ?? 0,
          udnId: form.udnId ?? 0,
          fechaRecepcion: form.fechaRecepcion || null,
          referenciaCompra: form.referenciaCompra.trim() || null,
          detalles,
        } satisfies CreateRecepcion);
      }
      notify(isEdit ? 'Recepción actualizada.' : 'Recepción registrada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la recepción');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="recepciones">
      {vista === 'form' ? (
                <>
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Compras · Recepciones</span>
              <h1 className="page-title mb-0">{form.id > 0 ? `Editar recepción ${form.id}` : 'Nueva recepción'}</h1>
            </div>
            <div className="entity-actions">
              <button type="button" className="btn btn-secondary px-4" onClick={() => setVista('lista')}>Cancelar</button>
              <button type="button" className="btn btn-tec px-4" onClick={guardar} disabled={guardando}>Guardar recepción</button>
            </div>
          </div>

          <div className="form-card mb-4">
            <h2 className="fs-6 fw-bold mb-3">Datos de la recepción</h2>
            <div className="row g-3">
              <div className="col-md-6 form-group"><label>Empresa</label>
                <SelectCatalogo catalogo="empresas" value={form.empresaId} disabled={form.id > 0} invalido={!!errores.de('empresaId')} required
                  onChange={(id) => { set('empresaId', id); set('udnId', null); }} />
                <CampoError mensajes={errores.de('empresaId')} /></div>
              <div className="col-md-6 form-group"><label>UDN</label>
                <SelectCatalogo catalogo="udn" value={form.udnId} empresaId={form.empresaId} disabled={form.id > 0} invalido={!!errores.de('udnId')} required
                  onChange={(id) => set('udnId', id)} />
                <CampoError mensajes={errores.de('udnId')} /></div>
              <div className="col-md-6 form-group"><label>Fecha de recepción</label>
                <input type="date" aria-invalid={!!errores.de('fechaRecepcion')} value={form.fechaRecepcion}
                  onChange={(e) => set('fechaRecepcion', e.target.value)} />
                <CampoError mensajes={errores.de('fechaRecepcion')} /></div>
              <div className="col-md-6 form-group"><label>Referencia de compra</label>
                <input type="text" aria-invalid={!!errores.de('referenciaCompra')} value={form.referenciaCompra}
                  onChange={(e) => set('referenciaCompra', e.target.value)} />
                <CampoError mensajes={errores.de('referenciaCompra')} /></div>
              {form.id > 0 && (
                <div className="col-md-6 form-group"><label>Almacén</label>
                  <SelectCatalogo catalogo="almacenes" value={form.almacenId} empresaId={form.empresaId} udnId={form.udnId} invalido={!!errores.de('almacenId')}
                    onChange={(id) => set('almacenId', id)} />
                  <CampoError mensajes={errores.de('almacenId')} /></div>
              )}
            </div>
          </div>

          <div className="table-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h2 className="fs-6 fw-bold mb-0">
                Renglones <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis ms-1">{form.detalles.length}</span>
              </h2>                
            </div>
            <CampoError mensajes={errores.de('detalles')} />
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Piezas</th><th className="text-end">Quitar</th></tr>
                </thead>
                <tbody>
                  {form.detalles.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-muted py-4">Sin renglones.</td></tr>
                  )}
                  {form.detalles.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-muted">{i + 1}</td>
                      <td className="form-group"><SelectCatalogo catalogo="productos" value={r.productoId} onChange={(id) => cambiarRenglon(i, { productoId: id })} /></td>
                      <td className="form-group"><input type="number" min={0} step={1} aria-label="Cantidad" className="text-end" value={r.cantidad}
                        onChange={(e) => cambiarRenglon(i, { cantidad: Number(e.target.value) || 0 })} /></td>
                      <td className="form-group"><input type="number" min={0} step={1} aria-label="Piezas" className="text-end" value={r.cantidadPieza}
                        onChange={(e) => cambiarRenglon(i, { cantidadPieza: Number(e.target.value) || 0 })} /></td>
                      <td className="text-end">
                        <button type="button" className="action-btn disable" title="Quitar renglón" onClick={() => quitarRenglon(i)}><i className="bi bi-trash" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              <button type="button" className="btn btn-link text-decoration-none fw-bold px-0" onClick={agregarRenglon}>
              <i className="bi bi-plus-lg" /> Agregar renglón
            </button>            
          </div>
        </>
      ) : vista === 'lista' || !detalle ? (
        <>
           <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="eyebrow">Compras</span>
          <h1 className="page-title mb-0">Recepciones</h1>
        </div>
        {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nueva recepción</button>}
      </div>


      <form className="filter-panel" onSubmit={filtrar}>
        <div className="form-group">
          <label>Empresa</label>
          <SelectCatalogo catalogo="empresas" value={empresaId}
            onChange={(id) => { setEmpresaId(id); setUdnId(null); }} />
        </div>
        <div className="form-group">
          <label>UDN</label>
          <SelectCatalogo catalogo="udn" value={udnId} empresaId={empresaId} onChange={setUdnId} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-funnel" /> Filtrar</button>
      </form>

      <div className="table-card p-3">
        <div className="table-responsive">
          <table className="table table-cat align-middle">
            <thead>
              <tr><th>Folio</th><th>Fecha</th><th>Empresa</th><th>UDN</th><th>Referencia de compra</th><th>Renglones</th><th className="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              {estado === 'cargando' && (
                <tr><td colSpan={7} className="text-center text-muted py-4">Cargando…</td></tr>
              )}
              {estado === 'error' && (
                <tr><td colSpan={7} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>
              )}
              {estado === 'ok' && items.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted py-4">Sin registros.</td></tr>
              )}
              {estado === 'ok' && items.map((r) => (
                <tr key={r.id}>
                  <td>{r.serie}-{r.folio ?? '-'}</td><td>{fecha(r.fechaRecepcion)}</td>
                  <td>{nombreDe(empresas, r.empresaId)}</td><td>{nombreDe(udns, r.udnId)}</td>
                  <td>{r.referenciaCompra}</td><td>{r.recepcionDet.length}</td>
                                    <td className="text-end">
                    <button className="action-btn" title="Ver detalle" onClick={() => verDetalle(r.id)}><i className="bi bi-eye" /></button>
                    {puedeEscribir && <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(r.id)}><i className="bi bi-pencil" /></button>}
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
        etiqueta="recepciones"
      />
      
      </>
) : (
  <>
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <span className="eyebrow">Recepción</span>
        <h1 className="page-title mb-0">{detalle.serie}-{detalle.folio ?? '-'}</h1>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => setVista('lista')}><i className="bi bi-arrow-left" /> Regresar</button>
      </div>
    </div>

    <div className="form-card mb-4">
      <dl className="row mb-0">
        <dt className="col-sm-3">Fecha</dt><dd className="col-sm-9">{fecha(detalle.fechaRecepcion)}</dd>
        <dt className="col-sm-3">Empresa</dt><dd className="col-sm-9">{nombreDe(empresas, detalle.empresaId)}</dd>
        <dt className="col-sm-3">UDN</dt><dd className="col-sm-9">{nombreDe(udns, detalle.udnId)}</dd>
        <dt className="col-sm-3">Referencia de compra</dt><dd className="col-sm-9">{detalle.referenciaCompra || '-'}</dd>
        <dt className="col-sm-3">Transacción</dt><dd className="col-sm-9">{detalle.transaccion}</dd>
      </dl>
    </div>

    <div className="table-card p-3">
      <div className="table-responsive">
        <table className="table table-cat align-middle">
          <thead>
            <tr><th>Renglón</th><th>Producto</th><th>Cantidad</th><th>Piezas</th></tr>
          </thead>
          <tbody>
            {detalle.recepcionDet.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted py-4">Sin renglones.</td></tr>
            )}
            {detalle.recepcionDet.map((d) => (
              <tr key={d.id}>
                <td>{d.renglon}</td><td>{nombreDe(productos, d.productoId)}</td>
                <td>{d.cantidad}</td><td>{d.cantidadPieza}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>  
)}    
</AppLayout>
);
}
