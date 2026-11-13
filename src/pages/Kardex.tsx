// Consulta de Kardex. Equivale a renderKardex del panel viejo.
// Tres alcances: completo, por empresa, o por empresa y producto.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import Paginacion from '../components/Paginacion';
import { API } from '../lib/api';
import type { Filtros } from '../lib/paged';
import { useListadoPaginado } from '../lib/useListadoPaginado';
import { SelectCatalogo } from '../components/SelectCatalogo';

type Mode = 'productoEmpresa' | 'empresa' | 'completo';

const MODES: Record<Mode, {help: string }> = {
  productoEmpresa: { help: 'Usa el endpoint actual: /api/Kardex?idProducto=&idEmpresa=.' },
  empresa: { help: 'Movimientos de todos los productos de una empresa.' },
  completo: {  help: 'Movimientos de todas las empresas.' },
};

export default function Kardex() {
  const [mode, setMode] = useState<Mode>('productoEmpresa');
    const [idProducto, setIdProducto] = useState<number | null>(null);
  const [idEmpresa, setIdEmpresa] = useState<number | null>(null);
  const [aplicados, setAplicados] = useState<Filtros | null>(null);
  const listado = useListadoPaginado<Record<string, unknown>>(`${API}/Kardex`, aplicados ?? {});
  const { items, estado, errMsg } = listado;


  const cfg = MODES[mode];

    const consultar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAplicados({
      idEmpresa: mode === 'completo' ? null : idEmpresa,
      idProducto: mode === 'productoEmpresa' ? idProducto : null,
    });
    listado.irA(1);
  };


  return (
    <AppLayout active="kardex">
      <div className="mb-4">
        <span className="eyebrow">KPI's</span>
        <h1 className="page-title mb-0">Kardex</h1>
        <p className="page-subtitle">Consulta movimientos por alcance: completo, empresa o empresa y producto.</p>
      </div>

      <form className="filter-panel" onSubmit={consultar}>
        <div className="form-group">
          <label>Tipo de consulta</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="productoEmpresa">Por empresa y producto</option>
            <option value="empresa">Por empresa</option>
            <option value="completo">Kardex completo</option>
          </select>
          <small>{cfg.help}</small>
        </div>
                {mode === 'productoEmpresa' && (
          <div className="form-group">
            <label>Producto</label>
            <SelectCatalogo catalogo="productos" value={idProducto} required
              onChange={setIdProducto} />
          </div>
        )}
        {mode !== 'completo' && (
          <div className="form-group">
            <label>Empresa</label>
            <SelectCatalogo catalogo="empresas" value={idEmpresa} required
              onChange={setIdEmpresa} />
          </div>
        )}
        <button className="btn btn-tec" type="submit">
          <i className="bi bi-search" /> Consultar
        </button>
      </form>

            <div className="result-space">
        {aplicados === null && (
          <div className="empty-state"><i className="bi bi-graph-up" /><h2>Kardex</h2><p>Ingresa los parámetros para consultar la información.</p></div>
        )}
        {aplicados !== null && estado === 'cargando' && <div className="loading-state">Consultando Kardex…</div>}
        {aplicados !== null && estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando Kardex</h2><p>{errMsg}</p></div>
        )}
        {aplicados !== null && estado === 'ok' && (
          <>
            <DynamicTable payload={items} emptyTitle="Sin resultados" emptyMessage="No se encontraron movimientos para esos parámetros." />
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
