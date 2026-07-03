// Catálogo de solo lectura: Tipos de Transacción.
// Equivale a getTiposDeTransaccion del panel viejo.
import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { API, getJSON } from '../lib/api';

interface Tipo { id: number; descripcion?: string; naturaleza?: string }

export default function TiposTransaccion() {
  const [items, setItems] = useState<Tipo[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');

  useEffect(() => {
    (async () => {
      try {
        const data = await getJSON<Tipo[]>(`${API}/Catalogos/tipostransaccion`);
        setItems(Array.isArray(data) ? data : []);
        setEstado('ok');
      } catch {
        setEstado('error');
      }
    })();
  }, []);

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
                <tr><td colSpan={3} className="text-center text-danger py-4">No se pudo cargar.</td></tr>
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
    </AppLayout>
  );
}
