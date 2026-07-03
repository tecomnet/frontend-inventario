import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import Sims from './pages/Sims';
import Productos from './pages/Productos';
import Marcas from './pages/Marcas';
import Presentaciones from './pages/Presentaciones';
import UnidadesMedida from './pages/UnidadesMedida';
import Proveedores from './pages/Proveedores';
import Lineas from './pages/Lineas';
import Compras from './pages/Compras';
import Movimientos from './pages/Movimientos';
import Existencias from './pages/Existencias';
import BuscarExistencias from './pages/BuscarExistencias';
import Importador from './pages/Importador';
import ImportadorSims from './pages/ImportadorSims';
import Kardex from './pages/Kardex';
import Empresas from './pages/Empresas';
import UnidadesNegocio from './pages/UnidadesNegocio';
import Almacenes from './pages/Almacenes';
import TiposTransaccion from './pages/TiposTransaccion';

// Inicio usa Recharts (pesado): se carga en un chunk aparte solo al entrar.
const Inicio = lazy(() => import('./pages/Inicio'));

const auth = (el: ReactNode) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: '#6b7280' }}>Cargando…</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/inicio" element={auth(<Inicio />)} />
        <Route path="/sims" element={auth(<Sims />)} />
        <Route path="/productos" element={auth(<Productos />)} />
        <Route path="/marcas" element={auth(<Marcas />)} />
        <Route path="/presentaciones" element={auth(<Presentaciones />)} />
        <Route path="/unidades-medida" element={auth(<UnidadesMedida />)} />
        <Route path="/proveedores" element={auth(<Proveedores />)} />
        <Route path="/lineas" element={auth(<Lineas />)} />
        <Route path="/compras" element={auth(<Compras />)} />
        <Route path="/movimientos" element={auth(<Movimientos />)} />
        <Route path="/existencias" element={auth(<Existencias />)} />
        <Route path="/buscar-existencias" element={auth(<BuscarExistencias />)} />
        <Route path="/importador" element={auth(<Importador />)} />
        <Route path="/importador-sims" element={auth(<ImportadorSims />)} />
        <Route path="/kardex" element={auth(<Kardex />)} />
        <Route path="/empresas" element={auth(<Empresas />)} />
        <Route path="/unidades-negocio" element={auth(<UnidadesNegocio />)} />
        <Route path="/almacenes" element={auth(<Almacenes />)} />
        <Route path="/tipos-transaccion" element={auth(<TiposTransaccion />)} />

        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </Suspense>
  );
}
