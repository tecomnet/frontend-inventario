// Catálogo de solo lectura: Tipos de Transacción.
// Equivale a getTiposDeTransaccion del panel viejo.
import AppLayout from '../components/AppLayout';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import type { TipoTransaccion } from '../lib/api-types';
import { useListadoPaginado } from '../lib/useListadoPaginado';

export default function TiposTransaccion() {
  const listado = useListadoPaginado<TipoTransaccion>(`${API}/Catalogos/tipostransaccion`);
  const { items, estado, errMsg } = listado;

  return (
    <AppLayout active="tipos-transaccion">
      <div className="mb-4">
        <span className="eyebrow">Configuración</span>
        <h1 className="page-title mb-0">Tipos de Transacción</h1>
      </div>
      <div className="table-card p-3">
        <div className="table-responsive">
          <table className="table table-cat align-middle">
            <thead>
              <tr><th>Id</th><th>Descripción</th><th>Naturaleza</th></tr>
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
              {estado === 'ok' && items.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td><td>{m.descripcion}</td><td>{m.naturaleza}</td>
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
        etiqueta="tipos de transacción"
      />
    </AppLayout>
  );
}
