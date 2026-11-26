// Compras: lista paginada con filtros de empresa y UDN, detalle, alta y edición.
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
import type { Compra, CreateCompra, CreateCompraDetalle, UpdateCompra } from '../lib/api-types';
import { fecha, isoToInput } from '../lib/format';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';

/** Un renglón del formulario: producto todavía sin elegir = null. */
interface Renglon {
  productoId: number | null;
  cantidad: number;
  cantidadPieza: number;
  costoProveedor: number;
  costoUnitario: number;
}

/** Formulario de alta/edición; id 0 es alta. Los textos vacíos se mandan como null. */
interface FormCompra {
  id: number;
  empresaId: number | null;
  udnId: number | null;
  proveedorId: number | null;
  fechaCompra: string;
  fechaPago: string;
  folioProveedor: string;
  uudI_Factura: string;
  banco: string;
  referenciaPago: string;
  observaciones: string;
  estadoId: number | null;
  detalles: Renglon[];
}

// Id 3 = "Aplicado" del módulo Compras (tabla Estado), con el que se crean las compras.
const ESTADO_COMPRA_APLICADA = 3;

const renglonVacio: Renglon = {
  productoId: null,
  cantidad: 0,
  cantidadPieza: 0,
  costoProveedor: 0,
  costoUnitario: 0,
};
const vacio: FormCompra = {
  id: 0,
  empresaId: null,
  udnId: null,
  proveedorId: null,
  fechaCompra: '',
  fechaPago: '',
  folioProveedor: '',
  uudI_Factura: '',
  banco: '',
  referenciaPago: '',
  observaciones: '',
  estadoId: null,
  detalles: [renglonVacio],
};
const CAMPOS = [
  'empresaId',
  'udnId',
  'proveedorId',
  'fechaCompra',
  'fechaPago',
  'folioProveedor',
  'uudI_Factura',
  'banco',
  'referenciaPago',
  'observaciones',
  'detalles',
] as const;

export default function Compras() {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number | null>(null);
   const [aplicados, setAplicados] = useState<Filtros | null>(null);
  const listado = useListadoPaginado<Compra>(`${API}/Compras`, aplicados ?? {});
  const { items, estado, errMsg } = listado;
  const empresas = useCatalogo('empresas');
  const udns = useCatalogo('udn');
  const proveedores = useCatalogo('proveedores');
  const productos = useCatalogo('productos');

  const [vista, setVista] = useState<'lista' | 'detalle' | 'form'>('lista');
  const [detalle, setDetalle] = useState<Compra | null>(null);
  const [form, setForm] = useState<FormCompra>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const consultar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ empresaId, udnId });
    listado.irA(1);
  };

  const verDetalle = async (id: number) => {
    try {
      setDetalle(await getJSON<Compra>(`${API}/Compras/buscar?id=${id}`));
      setVista('detalle');
      window.scrollTo(0, 0);
    } catch (err) {
      notifyError(err, 'No se pudo cargar la compra');
    }
  };

  const abrirForm = (f: FormCompra) => {
    setForm(f);
    errores.limpiar();
    setVista('form');
    window.scrollTo(0, 0);
  };
  const abrirAlta = () => abrirForm(vacio);
  // Se pide la compra completa para editar con todos sus renglones.
  const abrirEdicion = async (id: number) => {
    try {
      const c = await getJSON<Compra>(`${API}/Compras/buscar?id=${id}`);
      abrirForm({
        id: c.id,
        empresaId: c.empresaId,
        udnId: c.udnId,
        proveedorId: c.idProveedor,
        fechaCompra: isoToInput(c.fechaCompra),
        fechaPago: isoToInput(c.fechaPago),
        folioProveedor: c.folioProveedor ?? '',
        uudI_Factura: c.uudI_Factura ?? '',
        banco: c.banco ?? '',
        referenciaPago: c.referenciaPago ?? '',
        observaciones: c.observaciones ?? '',
        estadoId: c.estadoId,
        detalles: c.compraDet.map((d) => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          cantidadPieza: d.cantidadPieza,
          costoProveedor: d.costoProveedor,
          costoUnitario: d.costoUnitario,
        })),
      });
    } catch (err) {
      notifyError(err, 'No se pudo cargar la compra');
    }
  };

  const set = <K extends keyof FormCompra>(k: K, v: FormCompra[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };

  // Renglones: agregar uno vacío, quitar el i, o cambiar solo un campo del i.
  const agregarRenglon = () => setForm((f) => ({ ...f, detalles: [...f.detalles, renglonVacio] }));
  const quitarRenglon = (i: number) =>
    setForm((f) => ({ ...f, detalles: f.detalles.filter((_, j) => j !== i) }));
  const cambiarRenglon = (i: number, cambios: Partial<Renglon>) => {
    setForm((f) => ({
      ...f,
      detalles: f.detalles.map((r, j) => (j === i ? { ...r, ...cambios } : r)),
    }));
    errores.limpiar('detalles');
  };

  const guardar = async () => {
    const isEdit = form.id > 0;
    // Los renglones sin producto no se mandan.
    const detalles: CreateCompraDetalle[] = form.detalles.flatMap((r) =>
      r.productoId ? [{ ...r, productoId: r.productoId }] : [],
    );
    // Opcionales: vacío se manda como null.
    const datos = {
      folioProveedor: form.folioProveedor.trim() || null,
      uudI_Factura: form.uudI_Factura.trim() || null,
      banco: form.banco.trim() || null,
      referenciaPago: form.referenciaPago.trim() || null,
      fechaCompra: form.fechaCompra || null,
      fechaPago: form.fechaPago || null,
      observaciones: form.observaciones.trim() || null,
    };
    setGuardando(true);
    try {
      if (isEdit) {
        await sendJSON('PUT', `${API}/Compras/${form.id}`, {
          id: form.id,
          proveedorId: form.proveedorId,
          ...datos,
          estadoId: form.estadoId,
          detalles,
        } satisfies UpdateCompra);
      } else {
        await sendJSON('POST', `${API}/Compras`, {
          empresaId: form.empresaId ?? 0,
          udnId: form.udnId ?? 0,
          proveedorId: form.proveedorId ?? 0,
          ...datos,
          estadoId: ESTADO_COMPRA_APLICADA,
          detalles,
        } satisfies CreateCompra);
      }
      notify(isEdit ? 'Compra actualizada.' : 'Compra registrada.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo guardar la compra');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="compras">
      {vista === 'lista' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Compras</span>
              <h1 className="page-title mb-0">Compras</h1>
                            <p className="page-subtitle">Consulta de compras por empresa y UDN.</p>
            </div>
            {puedeEscribir && (
              <button className="btn btn-tec" onClick={abrirAlta}>
                <i className="bi bi-plus-lg" /> Nueva compra
              </button>
            )}
          </div>

          <form className="filter-panel" onSubmit={consultar}>
            <div className="form-group">
              <label htmlFor='compras-filtro-empresa'>Empresa</label>
              <SelectCatalogo
                id="compras-filtro-empresa"
                catalogo="empresas"
                value={empresaId}
                required
                onChange={(id) => {
                  setEmpresaId(id);
                  setUdnId(null);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="compras-filtro-udn">UDN</label>
              <SelectCatalogo
                id="compras-filtro-udn"
                catalogo="udn"
                value={udnId}
                empresaId={empresaId}
                required
                onChange={setUdnId}
              />
            </div>
            <button className="btn btn-tec" type="submit">
              <i className="bi bi-search" /> Consultar
            </button>
          </form>

          {aplicados === null ? (
            <div className="empty-state"><i className="bi bi-cart" /><h2>Compras</h2><p>Elige los parámetros para consultar.</p></div>
          ) : (
            <>
          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Fecha</th>
                    <th>Empresa</th>
                    <th>UDN</th>
                    <th>Proveedor</th>
                    <th>Folio proveedor</th>
                    <th>Renglones</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estado === 'cargando' && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
                        Cargando…
                      </td>
                    </tr>
                  )}
                  {estado === 'error' && (
                    <tr>
                      <td colSpan={8} className="text-center text-danger py-4">
                        {errMsg || 'No se pudo cargar.'}
                      </td>
                    </tr>
                  )}
                  {estado === 'ok' && items.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
                        Sin registros.
                      </td>
                    </tr>
                  )}
                  {estado === 'ok' &&
                    items.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {c.serie}-{c.folio ?? '-'}
                        </td>
                        <td>{fecha(c.fechaCompra)}</td>
                        <td>{nombreDe(empresas, c.empresaId)}</td>
                        <td>{nombreDe(udns, c.udnId)}</td>
                        <td>{nombreDe(proveedores, c.idProveedor)}</td>
                        <td>{c.folioProveedor || '-'}</td>
                        <td>{c.compraDet.length}</td>
                                                <td className="text-end">
                          <button className="action-btn" title="Ver detalle" aria-label={`Ver detalle de la compra ${c.id}`} onClick={() => verDetalle(c.id)}>
                            <i className="bi bi-eye" />
                          </button>
                          {puedeEscribir && (
                            <button className="action-btn edit" title="Editar" aria-label={`Editar compra ${c.id}`} onClick={() => abrirEdicion(c.id)}>
                              <i className="bi bi-pencil" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <Paginacion
            page={listado.page}
            pageSize={listado.pageSize}
            totalRecords={listado.totalRecords}
            totalPages={listado.totalPages}
            onPage={listado.irA}
            onPageSize={listado.cambiarPageSize}
            etiqueta="compras"
          />
        </>
          )}
          </>
      ) : vista === 'detalle' && detalle ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Compra</span>
              <h1 className="page-title mb-0">
                {detalle.serie}-{detalle.folio ?? '-'}
              </h1>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary" onClick={() => setVista('lista')}>
                <i className="bi bi-arrow-left" /> Regresar
              </button>
            </div>
          </div>

          <div className="form-card mb-4">
            <dl className="row mb-0">
              <dt className="col-sm-3">Fecha de compra</dt>
              <dd className="col-sm-9">{fecha(detalle.fechaCompra)}</dd>
              <dt className="col-sm-3">Empresa</dt>
              <dd className="col-sm-9">{nombreDe(empresas, detalle.empresaId)}</dd>
              <dt className="col-sm-3">UDN</dt>
              <dd className="col-sm-9">{nombreDe(udns, detalle.udnId)}</dd>
              <dt className="col-sm-3">Proveedor</dt>
              <dd className="col-sm-9">{nombreDe(proveedores, detalle.idProveedor)}</dd>
              <dt className="col-sm-3">Folio proveedor</dt>
              <dd className="col-sm-9">{detalle.folioProveedor || '-'}</dd>
              <dt className="col-sm-3">UUID factura</dt>
              <dd className="col-sm-9">{detalle.uudI_Factura || '-'}</dd>
              <dt className="col-sm-3">Banco</dt>
              <dd className="col-sm-9">{detalle.banco || '-'}</dd>
              <dt className="col-sm-3">Referencia de pago</dt>
              <dd className="col-sm-9">{detalle.referenciaPago || '-'}</dd>
              <dt className="col-sm-3">Fecha de pago</dt>
              <dd className="col-sm-9">{fecha(detalle.fechaPago)}</dd>
              <dt className="col-sm-3">Referencia</dt>
              <dd className="col-sm-9">{detalle.referencia || '-'}</dd>
              <dt className="col-sm-3">Observaciones</dt>
              <dd className="col-sm-9">{detalle.observaciones || '-'}</dd>
            </dl>
          </div>

          <div className="table-card p-3">
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>Renglón</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Piezas</th>
                    <th>Costo proveedor</th>
                    <th>Costo unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.compraDet.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        Sin renglones.
                      </td>
                    </tr>
                  )}
                  {detalle.compraDet.map((d) => (
                    <tr key={d.id}>
                      <td>{d.renglon}</td>
                      <td>{nombreDe(productos, d.productoId)}</td>
                      <td>{d.cantidad}</td>
                      <td>{d.cantidadPieza}</td>
                      <td>{d.costoProveedor}</td>
                      <td>{d.costoUnitario}</td>
                      <td>{d.total}</td>
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
              <span className="eyebrow">Compras</span>
              <h1 className="page-title mb-0">
                {form.id > 0 ? `Editar compra ${form.id}` : 'Nueva compra'}
              </h1>
            </div>
            <div className="entity-actions">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => setVista('lista')}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-tec px-4"
                onClick={guardar}
                disabled={guardando}
              >
                Guardar compra
              </button>
            </div>
          </div>

          <div className="form-card mb-4">
            <h2 className="fs-6 fw-bold mb-3">Datos de la compra</h2>
            <div className="row g-3">
              <div className="col-md-6 form-group">
                <label htmlFor='compra-empresa'>Empresa</label>
                <SelectCatalogo
                  id="compra-empresa"
                  catalogo="empresas"
                  value={form.empresaId}
                  disabled={form.id > 0}
                  invalido={!!errores.de('empresaId')}
                  required
                  onChange={(id) => {
                    set('empresaId', id);
                    set('udnId', null);
                  }}
                />
                <CampoError mensajes={errores.de('empresaId')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-udn'>UDN</label>
                <SelectCatalogo
                  id="compra-udn"
                  catalogo="udn"
                  value={form.udnId}
                  empresaId={form.empresaId}
                  disabled={form.id > 0}
                  invalido={!!errores.de('udnId')}
                  required
                  onChange={(id) => set('udnId', id)}
                />
                <CampoError mensajes={errores.de('udnId')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-proveedor'>Proveedor</label>
                <SelectCatalogo
                  id="compra-proveedor"
                  catalogo="proveedores"
                  value={form.proveedorId}
                  invalido={!!errores.de('proveedorId')}
                  required
                  onChange={(id) => set('proveedorId', id)}
                />
                <CampoError mensajes={errores.de('proveedorId')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-folio'>Folio proveedor</label>
                <input
                  id="compra-folio"
                  type="text"
                  aria-invalid={!!errores.de('folioProveedor')}
                  value={form.folioProveedor}
                  onChange={(e) => set('folioProveedor', e.target.value)}
                />
                <CampoError mensajes={errores.de('folioProveedor')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-fecha-compra'>Fecha de compra</label>
                <input
                  id="compra-fecha-compra"
                  type="date"
                  aria-invalid={!!errores.de('fechaCompra')}
                  value={form.fechaCompra}
                  onChange={(e) => set('fechaCompra', e.target.value)}
                />
                <CampoError mensajes={errores.de('fechaCompra')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-fecha-pago'>Fecha de pago</label>
                <input
                  id="compra-fecha-pago"
                  type="date"
                  aria-invalid={!!errores.de('fechaPago')}
                  value={form.fechaPago}
                  onChange={(e) => set('fechaPago', e.target.value)}
                />
                <CampoError mensajes={errores.de('fechaPago')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-uuid'>UUID factura</label>
                <input
                  id="compra-uuid"
                  type="text"
                  aria-invalid={!!errores.de('uudI_Factura')}
                  value={form.uudI_Factura}
                  onChange={(e) => set('uudI_Factura', e.target.value)}
                />
                <CampoError mensajes={errores.de('uudI_Factura')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-banco'>Banco</label>
                <input
                id="compra-banco"
                  type="text"
                  aria-invalid={!!errores.de('banco')}
                  value={form.banco}
                  onChange={(e) => set('banco', e.target.value)}
                />
                <CampoError mensajes={errores.de('banco')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-referencia-pago'>Referencia de pago</label>
                <input
                id="compra-referencia-pago"
                  type="text"
                  aria-invalid={!!errores.de('referenciaPago')}
                  value={form.referenciaPago}
                  onChange={(e) => set('referenciaPago', e.target.value)}
                />
                <CampoError mensajes={errores.de('referenciaPago')} />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor='compra-observaciones'>Observaciones</label>
                <input
                id="compra-observaciones"
                  type="text"
                  aria-invalid={!!errores.de('observaciones')}
                  value={form.observaciones}
                  onChange={(e) => set('observaciones', e.target.value)}
                />
                <CampoError mensajes={errores.de('observaciones')} />
              </div>
            </div>
          </div>

          <div className="table-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h2 className="fs-6 fw-bold mb-0">
                Renglones{' '}
                <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis ms-1">
                  {form.detalles.length}
                </span>
              </h2>
            </div>
            <CampoError mensajes={errores.de('detalles')} />
            <div className="table-responsive">
              <table className="table table-cat align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Piezas</th>
                    <th>Costo proveedor</th>
                    <th>Costo unitario</th>
                    <th className="text-end">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {form.detalles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        Sin renglones.
                      </td>
                    </tr>
                  )}
                  {form.detalles.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-muted">{i + 1}</td>
                      <td className="form-group">
                        <SelectCatalogo
                          catalogo="productos"
                          value={r.productoId}
                          onChange={(id) => cambiarRenglon(i, { productoId: id })}
                        />
                      </td>
                      <td className="form-group">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          aria-label="Cantidad"
                          className="text-end"
                          value={r.cantidad}
                          onChange={(e) =>
                            cambiarRenglon(i, { cantidad: Number(e.target.value) || 0 })
                          }
                        />
                      </td>
                      <td className="form-group">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          aria-label="Piezas"
                          className="text-end"
                          value={r.cantidadPieza}
                          onChange={(e) =>
                            cambiarRenglon(i, { cantidadPieza: Number(e.target.value) || 0 })
                          }
                        />
                      </td>
                      <td className="form-group">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          aria-label="Costo proveedor"
                          className="text-end"
                          value={r.costoProveedor}
                          onChange={(e) =>
                            cambiarRenglon(i, { costoProveedor: Number(e.target.value) || 0 })
                          }
                        />
                      </td>
                      <td className="form-group">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          aria-label="Costo unitario"
                          className="text-end"
                          value={r.costoUnitario}
                          onChange={(e) =>
                            cambiarRenglon(i, { costoUnitario: Number(e.target.value) || 0 })
                          }
                        />
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="action-btn disable"
                          title="Quitar renglón"
                          aria-label={`Quitar renglón ${i + 1}`}
                          onClick={() => quitarRenglon(i)}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-link text-decoration-none fw-bold px-0"
              onClick={agregarRenglon}
            >
              <i className="bi bi-plus-lg" /> Agregar renglón
            </button>
          </div>
        </>
      )}
    </AppLayout>
  );
}
