// Listado de Existencias. Equivale a getExistencias del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import type { Existencia } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { nombreDe, useCatalogo } from '../hooks/useCatalogo';
import type { Filtros } from '../lib/paged';
import { SelectCatalogo } from '../components/SelectCatalogo';

export default function Existencias() {
  const [idAlmacen, setIdAlmacen] = useState<number | null>(null);
  const [idProducto, setIdProducto] = useState<number | null>(null);
  const [aplicados, setAplicados] = useState<Filtros>({});
  const listado = useListadoPaginado<Existencia>(`${API}/Existencias`, aplicados);
  const { items, estado, errMsg } = listado;
  const empresas = useCatalogo('empresas')
  const udns = useCatalogo('udn')
  const almacenes = useCatalogo('almacenes')
  const productos = useCatalogo('productos')

  
  const filtrar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ idAlmacen, idProducto });
    listado.irA(1);
  };


  return (
    <AppLayout active="existencias">
      <div className="mb-4">
        <span className="eyebrow">Inventarios</span>
        <h1 className="page-title mb-0">Existencias</h1>
      </div>
            <form className="filter-panel" onSubmit={filtrar}>
        <div className="form-group">
          <label>Almacén</label>
          <SelectCatalogo catalogo="almacenes" value={idAlmacen} onChange={setIdAlmacen} />
        </div>
        <div className="form-group">
          <label>Producto</label>
          <SelectCatalogo catalogo="productos" value={idProducto} onChange={setIdProducto} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-funnel" /> Filtrar</button>
      </form>
      <div className="table-card p-3">
        <div className="table-responsive">
          <table className="table table-cat align-middle">
            <thead>
              <tr><th>Empresa</th><th>Udn</th><th>Almacén</th><th>Producto</th><th>Cantidad</th><th>Piezas</th></tr>
            </thead>
            <tbody>
              {estado === 'cargando' && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Cargando…</td></tr>
              )}
              {estado === 'error' && (
                <tr><td colSpan={6} className="text-center text-danger py-4">{errMsg || 'No se pudo cargar.'}</td></tr>
              )}
              {estado === 'ok' && items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Sin registros.</td></tr>
              )}
              {estado === 'ok' && items.map((e, i) => (
                <tr key={i}>
                  <td>{nombreDe(empresas, e.empresaId)}</td><td>{nombreDe(udns, e.udnId)}</td><td>{nombreDe(almacenes, e.almacenId)}</td>
                  <td>{nombreDe(productos, e.productoId)}</td><td>{e.cantidad}</td><td>{e.cantidadPiezas}</td>
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
        etiqueta="existencias"
      />
    </AppLayout>
  );
}
