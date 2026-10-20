// Consulta de Compras por empresa y UDN. Equivale a renderCompras del panel.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import { API, getJSON } from '../lib/api';
import { describirError } from '../lib/errores';

export default function Compras() {
  const [empresaId, setEmpresaId] = useState('');
  const [udnId, setUdnId] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [payload, setPayload] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState('');

  const consultar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEstado('cargando');
    try {
      const res = await getJSON(
        `${API}/Compras?empresaId=${encodeURIComponent(empresaId)}&udnId=${encodeURIComponent(udnId)}`,
      );
      setPayload(res);
      setEstado('ok');
    } catch (err) {
      setErrMsg(describirError(err).mensaje);
      setEstado('error');
    }
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
          <label>Empresa Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>UDN Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={udnId} onChange={(e) => setUdnId(e.target.value)} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Consultar</button>
      </form>

      <div className="result-space">
        {estado === 'idle' && (
          <div className="empty-state"><i className="bi bi-cart" /><h2>Compras</h2><p>Ingresa los parámetros para consultar.</p></div>
        )}
        {estado === 'cargando' && <div className="loading-state">Consultando compras…</div>}
        {estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando compras</h2><p>{errMsg}</p></div>
        )}
        {estado === 'ok' && (
          <DynamicTable payload={payload} emptyTitle="Sin resultados" emptyMessage="No se encontraron compras." />
        )}
      </div>
    </AppLayout>
  );
}
