// Buscar Existencias por empresa, almacén, UDN y producto.
// Equivale a renderBuscarExistencias del panel viejo.
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import DynamicTable from '../components/DynamicTable';
import { API, getJSON } from '../lib/api';
import { describirError } from '../lib/errores';
import { SelectCatalogo } from '../components/SelectCatalogo';

export default function BuscarExistencias() {
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [almacenId, setAlmacenId] = useState<number | null>(null);
  const [udnId, setUdnId] = useState<number | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);

  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [payload, setPayload] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState('');

  const consultar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEstado('cargando');
    try {
      const url = `${API}/Existencias/buscar?empresaId=${empresaId}`
        + `&almacenId=${almacenId}`
        + `&udnId=${udnId}`
        + `&productoId=${productoId}`;

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
          <label>Empresa</label>
          <SelectCatalogo catalogo="empresas" value={empresaId} required
            onChange={(id) => { setEmpresaId(id); setUdnId(null); setAlmacenId(null); }} />
        </div>
        <div className="form-group">
          <label>UDN</label>
          <SelectCatalogo catalogo="udn" value={udnId} empresaId={empresaId} required
            onChange={(id) => { setUdnId(id); setAlmacenId(null); }} />
        </div>
        <div className="form-group">
          <label>Almacén</label>
          <SelectCatalogo catalogo="almacenes" value={almacenId} empresaId={empresaId} udnId={udnId} required
            onChange={setAlmacenId} />
        </div>
        <div className="form-group">
          <label>Producto</label>
          <SelectCatalogo catalogo="productos" value={productoId} required
            onChange={setProductoId} />
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
