// Listado de Existencias. Equivale a getExistencias del panel viejo.
import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { API, getJSON } from '../lib/api';

interface Existencia {
  empresaId?: number; udnId?: number; almacenId?: number;
  productoId?: number; cantidad?: number; cantidadPiezas?: number;
}

export default function Existencias() {
  const [items, setItems] = useState<Existencia[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');

  useEffect(() => {
    (async () => {
      try {
        const data = await getJSON<Existencia[]>(`${API}/Existencias`);
        setItems(Array.isArray(data) ? data : []);
        setEstado('ok');
      } catch {
        setEstado('error');
      }
    })();
  }, []);

  return (
    <AppLayout active="existencias">
      <div className="mb-4">
        <span className="eyebrow">Inventarios</span>
        <h1 className="page-title mb-0">Existencias</h1>
      </div>
      <div className="table-card p-3">
        <div className="table-responsive">
          <table className="table table-cat align-middle">
            <thead>
              <tr><th>Empresa</th><th>Udn</th><th>Almacén</th><th>Producto</th><th>Cantidad</th><th>Piezas</th></tr>
            </thead>
            <tbody>
              {estado === 'cargando' && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Cargando…</td></tr>
              )}
              {estado === 'error' && (
                <tr><td colSpan={6} className="text-center text-danger py-4">No se pudo cargar.</td></tr>
              )}
              {estado === 'ok' && items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Sin registros.</td></tr>
              )}
              {estado === 'ok' && items.map((e, i) => (
                <tr key={i}>
                  <td>{e.empresaId}</td><td>{e.udnId}</td><td>{e.almacenId}</td>
                  <td>{e.productoId}</td><td>{e.cantidad}</td><td>{e.cantidadPiezas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
