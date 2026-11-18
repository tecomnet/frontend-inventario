// Ajustes de inventario: lista paginada y alta (solo con permiso de escritura).
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
import type { Ajuste, CreateAjuste, CreateAjusteDetalle } from '../lib/api-types';
import { fecha } from '../lib/format';
import { useListadoPaginado } from '../lib/useListadoPaginado';


interface Renglon {
  productoId: number | null;
  cantidad: number;
  cantidadPiezas: number;
  costo: number;
}

interface FormAjuste {
  empresaId: number | null;
  udnId: number | null;
  tipoTransaccionId: number | null;
  almacenId: number | null;
  observaciones: string;
  detalles: Renglon[];
}

const ESTADO_AJUSTE_APLICADO = 9;

const renglonVacio: Renglon = { productoId: null, cantidad: 0, cantidadPiezas: 0, costo: 0 };
const vacio: FormAjuste = {
  empresaId: null, udnId: null, tipoTransaccionId: null, almacenId: null, observaciones: '', detalles: [renglonVacio],
};
const CAMPOS = ['empresaId', 'udnId', 'tipoTransaccionId', 'almacenId', 'observaciones', 'detalles'] as const;


export default function Ajustes() {
  const { notify } = useUI();
  const { puedeEscribir } = usePermisos();
  const listado = useListadoPaginado<Ajuste>(`${API}/Ajustes`);
  const { items, estado, errMsg } = listado;
  const empresas = useCatalogo('empresas');
  const udns = useCatalogo('udn');

    const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [form, setForm] = useState<FormAjuste>(vacio);
  const [guardando, setGuardando] = useState(false);
  const errores = useErroresForm(CAMPOS);

  const abrirAlta = () => {
    setForm(vacio); errores.limpiar(); setVista('form'); window.scrollTo(0, 0);
  };

  const set = <K extends keyof FormAjuste>(k: K, v: FormAjuste[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    errores.limpiar(k);
  };

  const agregarRenglon = () => setForm((f) => ({ ...f, detalles: [...f.detalles, renglonVacio] }));
  const quitarRenglon = (i: number) => setForm((f) => ({ ...f, detalles: f.detalles.filter((_, j) => j !== i) }));
  const cambiarRenglon = (i: number, cambios: Partial<Renglon>) => {
    setForm((f) => ({ ...f, detalles: f.detalles.map((r, j) => (j === i ? { ...r, ...cambios } : r)) }));
    errores.limpiar('detalles');
  };

  const guardar = async () => {
    const detalles: CreateAjusteDetalle[] = form.detalles.flatMap((r) =>
      r.productoId ? [{ productoId: r.productoId, cantidad: r.cantidad, cantidadPiezas: r.cantidadPiezas, costo: r.costo }] : []);
    setGuardando(true);
    try {
      await sendJSON('POST', `${API}/Ajustes`, {
        empresaId: form.empresaId ?? 0,
        udnId: form.udnId ?? 0,
        tipoTransaccionId: form.tipoTransaccionId ?? 0,
        almacenId: form.almacenId ?? 0,
        observaciones: form.observaciones.trim() || null,
        estadoId: ESTADO_AJUSTE_APLICADO,
        detalles,
      } satisfies CreateAjuste);
      notify('Ajuste registrado.', 'success');
      await listado.recargar();
      setVista('lista');
    } catch (err) {
      errores.capturar(err, 'No se pudo registrar el ajuste');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout active="ajustes">
              {vista === 'form' ? (
        <>
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Inventarios · Ajustes</span>
              <h1 className="page-title mb-0">Nuevo ajuste</h1>
            </div>
            <div className="entity-actions">
              <button type="button" className="btn btn-secondary px-4" onClick={() => setVista('lista')}>Cancelar</button>
              <button type="button" className="btn btn-tec px-4" onClick={guardar} disabled={guardando}>Guardar ajuste</button>
            </div>
          </div>

          <div className="form-card mb-4">
            <h2 className="fs-6 fw-bold mb-3">Datos del ajuste</h2>
            <div className="row g-3">
              <div className="col-md-6 form-group"><label>Empresa</label>
                <SelectCatalogo catalogo="empresas" value={form.empresaId} invalido={!!errores.de('empresaId')} required
                  onChange={(id) => { set('empresaId', id); set('udnId', null); set('almacenId', null); }} />
                <CampoError mensajes={errores.de('empresaId')} /></div>
              <div className="col-md-6 form-group"><label>UDN</label>
                <SelectCatalogo catalogo="udn" value={form.udnId} empresaId={form.empresaId} invalido={!!errores.de('udnId')} required
                  onChange={(id) => { set('udnId', id); set('almacenId', null); }} />
                <CampoError mensajes={errores.de('udnId')} /></div>
              <div className="col-md-6 form-group"><label>Almacén</label>
                <SelectCatalogo catalogo="almacenes" value={form.almacenId} empresaId={form.empresaId} udnId={form.udnId} invalido={!!errores.de('almacenId')} required
                  onChange={(id) => set('almacenId', id)} />
                <CampoError mensajes={errores.de('almacenId')} /></div>
              <div className="col-md-6 form-group"><label>Tipo de transacción</label>
                <SelectCatalogo catalogo="tiposTransaccion" value={form.tipoTransaccionId} invalido={!!errores.de('tipoTransaccionId')} required
                  onChange={(id) => set('tipoTransaccionId', id)} />
                <CampoError mensajes={errores.de('tipoTransaccionId')} /></div>
              <div className="col-12 form-group"><label>Observaciones</label>
                <input type="text" aria-invalid={!!errores.de('observaciones')} value={form.observaciones}
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
                  <tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Piezas</th><th>Costo</th><th className="text-end">Quitar</th></tr>
                </thead>
                <tbody>
                  {form.detalles.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted py-4">Sin renglones.</td></tr>
                  )}
                  {form.detalles.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-muted">{i + 1}</td>
                      <td className="form-group"><SelectCatalogo catalogo="productos" value={r.productoId} onChange={(id) => cambiarRenglon(i, { productoId: id })} /></td>
                      <td className="form-group"><input type="number" min={0} step={1} aria-label="Cantidad" className="text-end" value={r.cantidad}
                        onChange={(e) => cambiarRenglon(i, { cantidad: Number(e.target.value) || 0 })} /></td>
                      <td className="form-group"><input type="number" min={0} step={1} aria-label="Piezas" className="text-end" value={r.cantidadPiezas}
                        onChange={(e) => cambiarRenglon(i, { cantidadPiezas: Number(e.target.value) || 0 })} /></td>
                      <td className="form-group"><input type="number" min={0} step={0.01} aria-label="Costo" className="text-end" value={r.costo}
                        onChange={(e) => cambiarRenglon(i, { costo: Number(e.target.value) || 0 })} /></td>
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
      ) : (
        <>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">Inventarios</span>
              <h1 className="page-title mb-0">Ajustes de inventario</h1>
            </div>
            {puedeEscribir && <button className="btn btn-tec" onClick={abrirAlta}><i className="bi bi-plus-lg" /> Nuevo ajuste</button>}
          </div>

      <div className="table-card p-3">
        <div className="table-responsive">
          <table className="table table-cat align-middle">
            <thead>
              <tr><th>Folio</th><th>Fecha</th><th>Empresa</th><th>UDN</th><th>Transacción</th><th>Renglones</th><th>Observaciones</th></tr>
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
              {estado === 'ok' && items.map((a) => (
                <tr key={a.id}>
                  <td>{a.serie ?? '-'}-{a.folio ?? '-'}</td><td>{fecha(a.fecha)}</td>
                  <td>{nombreDe(empresas, a.empresaId)}</td><td>{nombreDe(udns, a.udnId)}</td>
                  <td>{a.transaccion ?? '-'}</td><td>{a.ajusteDet.length}</td><td>{a.observaciones || '-'}</td>
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
        etiqueta="ajustes"
      />
              </>
      )}
    </AppLayout>
  );
}
