// Consulta de Movimientos de Almacén por empresa, UDN y rango de fechas.
// Equivale a renderMovimientos del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { SelectCatalogo } from '../components/SelectCatalogo';

export default function Movimientos() {
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number |  null>(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [aplicados, setAplicados] = useState<Filtros | null>(null);
  const listado = useListadoPaginado<Record<string, unknown>>(`${API}/MovimientosDeAlmacen`, aplicados ?? {});
  const { items, estado, errMsg } = listado;


    const consultar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ empresaId, udnId, fechaDesde: desde, fechaHasta: hasta });
    listado.irA(1);
  };

  return (
    <AppLayout active="movimientos">
      <div className="mb-4">
        <span className="eyebrow">Inventarios</span>
        <h1 className="page-title mb-0">Movimientos de Almacén</h1>
        <p className="page-subtitle">Consulta por empresa, UDN y rango de fechas.</p>
      </div>

      <form className="filter-panel" onSubmit={consultar}>
                <div className="form-group">
          <label>Empresa</label>
          <SelectCatalogo catalogo="empresas" value={empresaId} required
            onChange={(id) => { setEmpresaId(id); setUdnId(null); }} />
        </div>
        <div className="form-group">
          <label>UDN</label>
          <SelectCatalogo catalogo="udn" value={udnId} empresaId={empresaId} required
            onChange={setUdnId} />
        </div>
        <div className="form-group">
          <label>Fecha desde</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha hasta</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Consultar</button>
      </form>

            <div className="result-space">
        {aplicados === null && (
          <div className="empty-state"><i className="bi bi-list-check" /><h2>Movimientos</h2><p>Ingresa los parámetros para consultar.</p></div>
        )}
        {aplicados !== null && estado === 'cargando' && <div className="loading-state">Consultando movimientos…</div>}
        {aplicados !== null && estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando movimientos</h2><p>{errMsg}</p></div>
        )}
        {aplicados !== null && estado === 'ok' && (
          <>
            <DynamicTable payload={items} emptyTitle="Sin resultados" emptyMessage="No se encontraron movimientos." />
            <Paginacion
              page={listado.page} pageSize={listado.pageSize}
              totalRecords={listado.totalRecords} totalPages={listado.totalPages}
              onPage={listado.irA} onPageSize={listado.cambiarPageSize}
              etiqueta="movimientos"
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
