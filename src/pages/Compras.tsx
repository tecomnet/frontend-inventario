// Consulta de Compras por empresa y UDN. Equivale a renderCompras del panel.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { SelectCatalogo } from '../components/SelectCatalogo';

export default function Compras() {
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number | null>(null);
  const [aplicados, setAplicados] = useState<Filtros | null>(null);
  const listado = useListadoPaginado<Record<string, unknown>>(`${API}/Compras`, aplicados ?? {});
  const { items, estado, errMsg } = listado;


    const consultar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({ empresaId, udnId });
    listado.irA(1);
  };


  return (
    <AppLayout active="compras">
      <div className="mb-4">
        <span className="eyebrow">Compras</span>
        <h1 className="page-title mb-0">Compras</h1>
        <p className="page-subtitle">Consulta de compras por empresa y UDN.</p>
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
        <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Consultar</button>
      </form>

            <div className="result-space">
        {aplicados === null && (
          <div className="empty-state"><i className="bi bi-cart" /><h2>Compras</h2><p>Elige los parámetros para consultar.</p></div>
        )}
        {aplicados !== null && estado === 'cargando' && <div className="loading-state">Consultando compras…</div>}
        {aplicados !== null && estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando compras</h2><p>{errMsg}</p></div>
        )}
        {aplicados !== null && estado === 'ok' && (
          <>
            <DynamicTable payload={items} emptyTitle="Sin resultados" emptyMessage="No se encontraron compras." />
            <Paginacion
              page={listado.page} pageSize={listado.pageSize}
              totalRecords={listado.totalRecords} totalPages={listado.totalPages}
              onPage={listado.irA} onPageSize={listado.cambiarPageSize}
              etiqueta="compras"
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
