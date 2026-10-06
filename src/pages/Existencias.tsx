// Listado de Existencias. Equivale a getExistencias del panel viejo.
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import { useListadoPaginado } from '../lib/useListadoPaginado';

interface Existencia {
  empresaId?: number; udnId?: number; almacenId?: number;
  productoId?: number; cantidad?: number; cantidadPiezas?: number;
}

export default function Existencias() {
  const listado = useListadoPaginado<Existencia>(`${API}/Existencias`);
  const { items, estado } = listado;

  return (
    <AppLayout active="existencias">
      <div className="mb-4">
        <span className="eyebrow">Inventarios</span>
        <h1 className="page-title mb-0">Existencias</h1>
      </div>
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
                <tr><td colSpan={6} className="text-center text-danger py-4">No se pudo cargar.</td></tr>
              )}
              {estado === 'ok' && items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Sin registros.</td></tr>
              )}
              {estado === 'ok' && items.map((e, i) => (
                <tr key={i}>
                  <td>{e.empresaId}</td><td>{e.udnId}</td><td>{e.almacenId}</td>
                  <td>{e.productoId}</td><td>{e.cantidad}</td><td>{e.cantidadPiezas}</td>
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
