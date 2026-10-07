// Buscar Existencias por empresa, almacén, UDN y producto.
// Equivale a renderBuscarExistencias del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import { API, getJSON } from '../lib/api';
import { describirError } from '../lib/errores';

export default function BuscarExistencias() {
  const [empresaId, setEmpresaId] = useState('');
  const [almacenId, setAlmacenId] = useState('');
  const [udnId, setUdnId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [payload, setPayload] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState('');

  const consultar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEstado('cargando');
    try {
      const url = `${API}/Existencias/buscar?empresaId=${encodeURIComponent(empresaId)}`
        + `&almacenId=${encodeURIComponent(almacenId)}`
        + `&udnId=${encodeURIComponent(udnId)}`
        + `&productoId=${encodeURIComponent(productoId)}`;
      const res = await getJSON(url);
      setPayload(res);
      setEstado('ok');
    } catch (err) {
      setErrMsg(describirError(err).mensaje);
      setEstado('error');
    }
  };

  return (
    <AppLayout active="buscar-existencias">
      <div className="mb-4">
        <span className="eyebrow">Inventarios</span>
        <h1 className="page-title mb-0">Buscar Existencias</h1>
        <p className="page-subtitle">Consulta existencias por empresa, almacén, UDN y producto.</p>
      </div>

      <form className="filter-panel" onSubmit={consultar}>
        <div className="form-group">
          <label>Empresa Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Almacén Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={almacenId} onChange={(e) => setAlmacenId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>UDN Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 1" required
            value={udnId} onChange={(e) => setUdnId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Producto Id</label>
          <input type="number" min={1} step={1} placeholder="Ej. 4" required
            value={productoId} onChange={(e) => setProductoId(e.target.value)} />
        </div>
        <button className="btn btn-tec" type="submit"><i className="bi bi-search" /> Consultar</button>
      </form>

      <div className="result-space">
        {estado === 'idle' && (
          <div className="empty-state"><i className="bi bi-boxes" /><h2>Buscar Existencias</h2><p>Ingresa los parámetros para consultar la información.</p></div>
        )}
        {estado === 'cargando' && <div className="loading-state">Consultando existencias…</div>}
        {estado === 'error' && (
          <div className="empty-state"><i className="bi bi-exclamation-triangle" /><h2>Error cargando existencias</h2><p>{errMsg}</p></div>
        )}
        {estado === 'ok' && (
          <DynamicTable payload={payload} emptyTitle="Sin resultados" emptyMessage="No se encontraron existencias para esos parámetros." />
        )}
      </div>
    </AppLayout>
  );
}
