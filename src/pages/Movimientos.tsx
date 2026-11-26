// Movimientos de Almacén: consulta por empresa, UDN y rango de fechas, detalle, alta y edición.
// Equivale a renderMovimientos del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import CampoError from '../components/CampoError';
import Paginacion from '../components/Paginacion';
import { SelectCatalogo } from '../components/SelectCatalogo';
import { useUI } from '../context/UIContext';
import { useErroresForm } from '../hooks/useErroresForm';
import { nombreDe, useCatalogo } from '../hooks/useCatalogo';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendJSON } from '../lib/api';
import type { CreateMovimiento, CreateMovimientoDetalle, Movimiento, UpdateMovimiento } from '../lib/api-types';
import { fecha } from '../lib/format';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';


/** Un renglón del formulario: producto todavía sin elegir = null. */
interface Renglon {
  productoId: number | null;
  cantidad: number;
  cantidadPiezas: number;
  costoUnitario: number;
  loteAltan: string;
  loteTecomnet: string;
}

/** Formulario de alta/edición; id 0 es alta. Al editar, el API solo acepta referencia y observaciones. */
interface FormMovimiento {
  id: number;
  empresaId: number | null;
  udnId: number | null;
  almacenId: number | null;
  tipoTransaccionId: number | null;
  referencia: string;
  observaciones: string;
  estadoId: number | null;
  detalles: Renglon[];
}

// Movimientos no tiene estados propios en la tabla Estado y afecta al inventario en cuanto
// se crea. Se usa el 3 ("Aplicado"), el mismo que pone el importador a los movimientos que
// ya existen. Cuando el API lo fije solo, se quita esta constante.
const ESTADO_MOVIMIENTO_APLICADO = 3;

const renglonVacio: Renglon = { productoId: null, cantidad: 0, cantidadPiezas: 0, costoUnitario: 0, loteAltan: '', loteTecomnet: '' };
const vacio: FormMovimiento = {
  id: 0, empresaId: null, udnId: null, almacenId: null, tipoTransaccionId: null,
  referencia: '', observaciones: '', estadoId: null, detalles: [renglonVacio],
};
const CAMPOS = ['empresaId', 'udnId', 'almacenId', 'tipoTransaccionId', 'referencia', 'observaciones', 'detalles'] as const;

export default function Movimientos() {
  const { notify } = useUI();
  const { puedeEscribir } = usePermisos();
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number |  null>(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [aplicados, setAplicados] = useState<Filtros | null>(null);
    const listado = useListadoPaginado<Movimiento>(`${API}/MovimientosDeAlmacen`, aplicados ?? {});
  const { items, estado, errMsg } = listado;
  const empresas = useCatalogo('empresas');
  const udns = useCatalogo('udn');
  const almacenes = useCatalogo('almacenes');
  const tipos = useCatalogo('tiposTransaccion');
  const productos = useCatalogo('productos');

  const [vista, setVista] = useState<'lista' | 'detalle' | 'form'>('lista');
  const [detalle, setDetalle] = useState<Movimiento | null>(null);
  const [form, setForm] = useState<FormMovimiento>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);


    const consultar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ empresaId, udnId, fechaDesde: desde, fechaHasta: hasta });
    listado.irA(1);
  };

  
  // La lista ya trae los renglones; GET /MovimientosDeAlmacen/buscar lee el id del
  // cuerpo de un GET y el navegador no puede mandarlo, así que no se usa.
  const verDetalle = (m: Movimiento) => {
    setDetalle(m); setVista('detalle'); window.scrollTo(0, 0);
  };

  const abrirForm = (f: FormMovimiento) => {
    setForm(f); errores.limpiar(); setVista('form'); window.scrollTo(0, 0);
  };
  const abrirAlta = () => abrirForm(vacio);
  const abrirEdicion = (m: Movimiento) => abrirForm({
    ...vacio, id: m.id, empresaId: m.empresaId, udnId: m.udnId,
    referencia: m.referencia ?? '', observaciones: m.observaciones ?? '', estadoId: m.estadoId,
  });

  const set = <K extends keyof FormMovimiento>(k: K, v: FormMovimiento[K]) => {
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
    setGuardando(true);
    try {
      if (isEdit) {
        await sendJSON('PUT', `${API}/MovimientosDeAlmacen/${form.id}`, {
          id: form.id,
          referencia: form.referencia.trim() || null,
          observaciones: form.observaciones.trim() || null,
          estadoId: form.estadoId,
        } satisfies UpdateMovimiento);
      } else {
        // Los renglones sin producto no se mandan; lotes vacíos van como null.
        const detalles: CreateMovimientoDetalle[] = form.detalles.flatMap((r) =>
          r.productoId ? [{
            productoId: r.productoId, cantidad: r.cantidad, cantidadPiezas: r.cantidadPiezas, costoUnitario: r.costoUnitario,
            loteAltan: r.loteAltan.trim() || null, loteTecomnet: r.loteTecomnet.trim() || null,
          }] : []);
        await sendJSON('POST', `${API}/MovimientosDeAlmacen`, {
          empresaId: form.empresaId ?? 0,
          udnId: form.udnId ?? 0,
          tipoTransaccionId: form.tipoTransaccionId ?? 0,
          almacenId: form.almacenId ?? 0,
          observaciones: form.observaciones.trim() || null,
          estadoId: ESTADO_MOVIMIENTO_APLICADO,
          detalles,
        } satisfies CreateMovimiento);
      }
      notify(isEdit ? 'Movimiento actualizado.' : 'Movimiento registrado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar el movimiento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="movimientos">
            {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Inventarios</span>
              <h1 className="page-title mb-0">Movimientos de Almacén</h1>
              <p className="page-subtitle">Consulta por empresa, UDN y rango de fechas.</p>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nuevo movimiento</button>}
          </div>

      <form className="filter-panel" onSubmit={consultar}>
                <div className="form-group">
          <label htmlFor="movimientos-filtro-empresa">Empresa</label>
          <SelectCatalogo id="movimientos-filtro-empresa" catalogo="empresas" value={empresaId} required
            onChange={(id) => { setEmpresaId(id); setUdnId(null); }} />
        </div>
        <div className="form-group">
          <label htmlFor="movimientos-filtro-udn">UDN</label>
          <SelectCatalogo id="movimientos-filtro-udn" catalogo="udn" value={udnId} empresaId={empresaId} required
            onChange={setUdnId} />
        </div>
        <div className="form-group">
          <label htmlFor="movimientos-filtro-desde">Fecha desde</label>
          <input id="movimientos-filtro-desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="movimientos-filtro-hasta">Fecha hasta</label>
          <input id="movimientos-filtro-hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Consultar</button>
      </form>

                  {aplicados === null ? (
            <div className="empty-state"><i className="bi bi-list-check" /><h2>Movimientos</h2><p>Ingresa los parámetros para consultar.</p></div>
          ) : (
            <>
              <div className="table-card p-3">
                <div className="table-responsive">
                  <table className="table table-cat align-middle">
                    <thead>
                      <tr><th>Folio</th><th>Fecha</th><th>Almacén</th><th>Tipo</th><th>Referencia</th><th>Renglones</th><th className="text-end">Acciones</th></tr>
                    </thead>
                    <tbody>
                      {estado === 'cargando' && (
                        <tr><td colSpan={7} className="text-center text-muted py-4">Consultando movimientos…</td></tr>
                      )}
                      {estado === 'error' && (
                        <tr><td colSpan={7} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>
                      )}
                      {estado === 'ok' && items.length === 0 && (
                        <tr><td colSpan={7} className="text-center text-muted py-4">No se encontraron movimientos.</td></tr>
                      )}
                      {estado === 'ok' && items.map((m) => (
                        <tr key={m.id}>
                          <td>{m.serie ?? '-'}-{m.folio ?? '-'}</td><td>{fecha(m.fecha)}</td>
                          <td>{nombreDe(almacenes, m.almacenId)}</td><td>{nombreDe(tipos, m.tipoTransaccionId)}</td>
                          <td>{m.referencia || '-'}</td><td>{m.movimientoDet.length}</td>
                          <td className="text-end">
                            <button className="action-btn" title="Ver detalle" aria-label={`Ver detalle del movimiento ${m.id}`} onClick={() => verDetalle(m)}><i className="bi bi-eye" /></button>
                            {puedeEscribir && <button className="action-btn edit" title="Editar" aria-label={`Editar movimiento ${m.id}`} onClick={() => abrirEdicion(m)}><i className="bi bi-pencil" /></button>}
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
                etiqueta="movimientos"
              />
            </>
          )}
        </>
      ) : vista === 'detalle' && detalle ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Movimiento</span>
              <h1 className="page-title mb-0">{detalle.serie ?? '-'}-{detalle.folio ?? '-'}</h1>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary" onClick={() => setVista('lista')}><i className="bi bi-arrow-left" /> Regresar</button>
            </div>
          </div>

          <div className="form-card mb-4">
            <dl className="row mb-0">
              <dt className="col-sm-3">Fecha</dt><dd className="col-sm-9">{fecha(detalle.fecha)}</dd>
              <dt className="col-sm-3">Empresa</dt><dd className="col-sm-9">{nombreDe(empresas, detalle.empresaId)}</dd>
              <dt className="col-sm-3">UDN</dt><dd className="col-sm-9">{nombreDe(udns, detalle.udnId)}</dd>
              <dt className="col-sm-3">Almacén</dt><dd className="col-sm-9">{nombreDe(almacenes, detalle.almacenId)}</dd>
              <dt className="col-sm-3">Tipo de transacción</dt><dd className="col-sm-9">{nombreDe(tipos, detalle.tipoTransaccionId)}</dd>
              <dt className="col-sm-3">Referencia</dt><dd className="col-sm-9">{detalle.referencia || '-'}</dd>
              <dt className="col-sm-3">Observaciones</dt><dd className="col-sm-9">{detalle.observaciones || '-'}</dd>
            </dl>
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr><th>Renglón</th><th>Producto</th><th>Cantidad</th><th>Piezas</th><th>Costo unitario</th><th>Lote Altan</th><th>Lote Tecomnet</th></tr>
                </thead>
                <tbody>
                  {detalle.movimientoDet.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted py-4">Sin renglones.</td></tr>
                  )}
                  {detalle.movimientoDet.map((d) => (
                    <tr key={d.id}>
                      <td>{d.renglon}</td><td>{nombreDe(productos, d.productoId)}</td>
                      <td>{d.cantidad}</td><td>{d.cantidadPiezas}</td><td>{d.costoUnitario ?? '-'}</td>
                      <td>{d.loteAltan || '-'}</td><td>{d.loteTecomnet || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Inventarios · Movimientos</span>
              <h1 className="page-title mb-0">{form.id > 0 ? `Editar movimiento ${form.id}` : 'Nuevo movimiento'}</h1>
            </div>
            <div className="entity-actions">
              <button type="button" className="btn btn-secondary px-4" onClick={() => setVista('lista')}>Cancelar</button>
              <button type="button" className="btn btn-tec px-4" onClick={guardar} disabled={guardando}>Guardar movimiento</button>
            </div>
          </div>

          {form.id > 0 ? (
            <div className="form-card mb-4">
              <h2 className="fs-6 fw-bold mb-3">Datos del movimiento</h2>
              <div className="row g-3">
                <div className="col-md-6 form-group"><label htmlFor="movimiento-referencia">Referencia</label>
                  <input id="movimiento-referencia" type="text" aria-invalid={!!errores.de('referencia')} value={form.referencia}
                    onChange={(e) => set('referencia', e.target.value)} />
                  <CampoError mensajes={errores.de('referencia')} /></div>
                <div className="col-md-6 form-group"><label htmlFor="movimiento-observaciones">Observaciones</label>
                  <input id="movimiento-observaciones" type="text" aria-invalid={!!errores.de('observaciones')} value={form.observaciones}
                    onChange={(e) => set('observaciones', e.target.value)} />
                  <CampoError mensajes={errores.de('observaciones')} /></div>
              </div>
            </div>
          ) : (
            <>
              <div className="form-card mb-4">
                <h2 className="fs-6 fw-bold mb-3">Datos del movimiento</h2>
                <div className="row g-3">
                  <div className="col-md-6 form-group"><label htmlFor="movimiento-empresa">Empresa</label>
                    <SelectCatalogo id="movimiento-empresa" catalogo="empresas" value={form.empresaId} invalido={!!errores.de('empresaId')} required
                      onChange={(id) => { set('empresaId', id); set('udnId', null); set('almacenId', null); }} />
                    <CampoError mensajes={errores.de('empresaId')} /></div>
                  <div className="col-md-6 form-group"><label htmlFor="movimiento-udn">UDN</label>
                    <SelectCatalogo id="movimiento-udn" catalogo="udn" value={form.udnId} empresaId={form.empresaId} invalido={!!errores.de('udnId')} required
                      onChange={(id) => { set('udnId', id); set('almacenId', null); }} />
                    <CampoError mensajes={errores.de('udnId')} /></div>
                  <div className="col-md-6 form-group"><label htmlFor="movimiento-almacen">Almacén</label>
                    <SelectCatalogo id="movimiento-almacen" catalogo="almacenes" value={form.almacenId} empresaId={form.empresaId} udnId={form.udnId} invalido={!!errores.de('almacenId')} required
                      onChange={(id) => set('almacenId', id)} />
                    <CampoError mensajes={errores.de('almacenId')} /></div>
                  <div className="col-md-6 form-group"><label htmlFor="movimiento-tipo">Tipo de transacción</label>
                    <SelectCatalogo id="movimiento-tipo" catalogo="tiposTransaccion" value={form.tipoTransaccionId} invalido={!!errores.de('tipoTransaccionId')} required
                      onChange={(id) => set('tipoTransaccionId', id)} />
                    <CampoError mensajes={errores.de('tipoTransaccionId')} /></div>
                  <div className="col-12 form-group"><label htmlFor="movimiento-observaciones">Observaciones</label>
                    <input id="movimiento-observaciones" type="text" aria-invalid={!!errores.de('observaciones')} value={form.observaciones}
                      onChange={(e) => set('observaciones', e.target.value)} />
                    <CampoError mensajes={errores.de('observaciones')} /></div>
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
                      <tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Piezas</th><th>Costo unitario</th><th>Lote Altan</th><th>Lote Tecomnet</th><th className="text-end">Quitar</th></tr>
                    </thead>
                    <tbody>
                      {form.detalles.length === 0 && (
                        <tr><td colSpan={8} className="text-center text-muted py-4">Sin renglones.</td></tr>
                      )}
                      {form.detalles.map((r, i) => (
                        <tr key={i}>
                          <td className="fw-bold text-muted">{i + 1}</td>
                          <td className="form-group"><SelectCatalogo catalogo="productos" value={r.productoId} onChange={(id) => cambiarRenglon(i, { productoId: id })} /></td>
                          <td className="form-group"><input type="number" min={0} step={1} aria-label="Cantidad" className="text-end" value={r.cantidad}
                            onChange={(e) => cambiarRenglon(i, { cantidad: Number(e.target.value) || 0 })} /></td>
                          <td className="form-group"><input type="number" min={0} step={1} aria-label="Piezas" className="text-end" value={r.cantidadPiezas}
                            onChange={(e) => cambiarRenglon(i, { cantidadPiezas: Number(e.target.value) || 0 })} /></td>
                          <td className="form-group"><input type="number" min={0} step={0.01} aria-label="Costo unitario" className="text-end" value={r.costoUnitario}
                            onChange={(e) => cambiarRenglon(i, { costoUnitario: Number(e.target.value) || 0 })} /></td>
                          <td className="form-group"><input type="text" aria-label="Lote Altan" value={r.loteAltan}
                            onChange={(e) => cambiarRenglon(i, { loteAltan: e.target.value })} /></td>
                          <td className="form-group"><input type="text" aria-label="Lote Tecomnet" value={r.loteTecomnet}
                            onChange={(e) => cambiarRenglon(i, { loteTecomnet: e.target.value })} /></td>
                          <td className="text-end">
                            <button type="button" className="action-btn disable" title="Quitar renglón" aria-label={`Quitar renglón ${i + 1}`} onClick={() => quitarRenglon(i)}><i className="bi bi-trash" /></button>
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
          )}
        </>
      )}    
    </AppLayout>
  );
}
