// Consulta de Movimientos de Almacén por empresa, UDN y rango de fechas.
// Equivale a renderMovimientos del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import { API, getJSON } from '../lib/api';

export default function Movimientos() {
  const [empresaId, setEmpresaId] = useState('');
  const [udnId, setUdnId] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [payload, setPayload] = useState<unknown>(null);

  const consultar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEstado('cargando');
    try {
      const params = new URLSearchParams({ empresaId, udnId });
      if (desde) params.set('fechaDesde', desde);
      if (hasta) params.set('fechaHasta', hasta);
      const res = await getJSON(`${API}/MovimientosDeAlmacen?${params.toString()}`);
      setPayload(res);
      setEstado('ok');
    } catch {
      setEstado('error');
    }
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
          <label>Empresa Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>UDN Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={udnId} onChange={(e) => setUdnId(e.target.value)} />
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
        {estado === 'idle' && (
          <div className="empty-state"><i className="bi bi-list-check" /><h2>Movimientos</h2><p>Ingresa los parámetros para consultar.</p></div>
        )}
        {estado === 'cargando' && <div className="loading-state">Consultando movimientos…</div>}
        {estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando movimientos</h2><p>Revisa los parámetros o el API.</p></div>
        )}
        {estado === 'ok' && (
          <DynamicTable payload={payload} emptyTitle="Sin resultados" emptyMessage="No se encontraron movimientos." />
        )}
      </div>
    </AppLayout>
  );
}
