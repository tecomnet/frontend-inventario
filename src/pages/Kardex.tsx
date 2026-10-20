// Consulta de Kardex. Equivale a renderKardex del panel viejo.
// Solo el modo "por empresa y producto" está disponible en la API.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import { API, getJSON } from '../lib/api';
import { describirError } from '../lib/errores';

type Mode = 'productoEmpresa' | 'empresa' | 'completo';

const MODES: Record<Mode, { ready: boolean; help: string }> = {
  productoEmpresa: { ready: true, help: 'Usa el endpoint actual: /api/Kardex?idProducto=&idEmpresa=.' },
  empresa: { ready: false, help: 'Pendiente: cuando exista, consultará el Kardex por empresa.' },
  completo: { ready: false, help: 'Pendiente: cuando exista, consultará el Kardex completo.' },
};

export default function Kardex() {
  const [mode, setMode] = useState<Mode>('productoEmpresa');
  const [idProducto, setIdProducto] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error' | 'pendiente'>('idle');
  const [payload, setPayload] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState('');

  const cfg = MODES[mode];

  const consultar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!cfg.ready) { setEstado('pendiente'); return; }
    setEstado('cargando');
    try {
      const res = await getJSON(
        `${API}/Kardex?idProducto=${encodeURIComponent(idProducto)}&idEmpresa=${encodeURIComponent(idEmpresa)}`,
      );
      setPayload(res);
      setEstado('ok');
    } catch (err) {
      setErrMsg(describirError(err).mensaje);
      setEstado('error');
    }
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
            <option value="empresa">Por empresa (pendiente)</option>
            <option value="completo">Kardex completo (pendiente)</option>
          </select>
          <small>{cfg.help}</small>
        </div>
        {mode === 'productoEmpresa' && (
          <div className="form-group">
            <label>Id Producto</label>
            <input type="number" min={1} step={1} placeholder="Ej. 4" required
              value={idProducto} onChange={(e) => setIdProducto(e.target.value)} />
          </div>
        )}
        {mode !== 'completo' && (
          <div className="form-group">
            <label>Id Empresa</label>
            <input type="number" min={1} step={1} placeholder="Ej. 1" required
              value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)} />
          </div>
        )}
        <button className="btn btn-tec" type="submit" disabled={!cfg.ready}>
          <i className="bi bi-search" /> Consultar
        </button>
      </form>

      <div className="result-space">
        {estado === 'idle' && (
          <div className="empty-state"><i className="bi bi-graph-up" /><h2>Kardex</h2><p>Ingresa los parámetros para consultar la información.</p></div>
        )}
        {estado === 'pendiente' && (
          <div className="empty-state"><i className="bi bi-tools" /><h2>Endpoint pendiente</h2><p>{cfg.help}</p></div>
        )}
        {estado === 'cargando' && <div className="loading-state">Consultando Kardex…</div>}
        {estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando Kardex</h2><p>{errMsg}</p></div>
        )}
        {estado === 'ok' && (
          <DynamicTable payload={payload} emptyTitle="Sin resultados" emptyMessage="No se encontraron movimientos para esos parámetros." />
        )}
      </div>
    </AppLayout>
  );
}
