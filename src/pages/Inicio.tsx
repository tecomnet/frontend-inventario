// Tablero de inicio: indicadores (KPIs) y gráficas con datos reales de
// productos. Equivale al Dashboard (view "home") del panel viejo, con Recharts.
import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import AppLayout from '../components/AppLayout';
import { API, getJSON } from '../lib/api';

interface Producto { id: number; descripcion?: string; iva?: number | string; ieps?: number | string }

const AZUL = '#1D4ED8';
const DONA = ['#10b981', '#f59e0b', '#64748b'];

export default function Inicio() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    getJSON<Producto[]>(`${API}/Productos`)
      .then((d) => { if (vivo) setProductos(Array.isArray(d) ? d : []); })
      .catch(() => { if (vivo) setProductos([]); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  const conIva = useMemo(() => productos.filter((p) => Number(p.iva) > 0).length, [productos]);
  const conIeps = useMemo(() => productos.filter((p) => Number(p.ieps) > 0).length, [productos]);

  const topProductos = useMemo(
    () => productos.slice(0, 20).map((p) => ({ name: String(p.descripcion ?? '-'), id: Number(p.id) || 0 })),
    [productos],
  );

  const impuestos = useMemo(() => [
    { name: 'Con IVA', value: conIva },
    { name: 'Con IEPS', value: conIeps },
    { name: 'Sin impuestos', value: productos.filter((p) => !Number(p.iva) && !Number(p.ieps)).length },
  ], [productos, conIva, conIeps]);

  const kpis = [
    { icon: 'bi-box-seam', color: '#1D4ED8', label: 'Total Productos', value: productos.length },
    { icon: 'bi-receipt', color: '#10b981', label: 'Productos con IVA', value: conIva },
    { icon: 'bi-cash-coin', color: '#f59e0b', label: 'Productos con IEPS', value: conIeps },
  ];

  return (
    <AppLayout active="inicio">
      <div className="mb-1">
        <span className="eyebrow">Resumen general</span>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Indicadores principales del sistema de inventario.</p>
      </div>

      <div className="row g-3 mt-1">
        {kpis.map((k) => (
          <div className="col-12 col-sm-6 col-xl-4" key={k.label}>
            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: `${k.color}1a`, color: k.color }}>
                <i className={`bi ${k.icon}`} />
              </div>
              <div>
                <div className="kpi-value">
                  {cargando
                    ? <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-label="Cargando" />
                    : k.value.toLocaleString('es-MX')}
                </div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cargando ? (
        <div className="dash-card chart-loading-card mt-3">
          <span className="spinner-border" role="status" aria-hidden="true" />
          <span>Cargando información…</span>
        </div>
      ) : (
        <div className="row g-3 mt-1">
          <div className="col-12 col-xl-7">
            <div className="dash-card">
              <div className="dash-card-title">Productos (primeros 20)</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductos} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
                  <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} height={8} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="id" name="ID" fill={AZUL} radius={[6, 6, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="dash-card">
              <div className="dash-card-title">Impuestos</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={impuestos} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={2}
                    label={({ value }) => value} labelLine={false} fontSize={13} fontWeight={600}>
                    {impuestos.map((d, i) => <Cell key={d.name} fill={DONA[i % DONA.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
