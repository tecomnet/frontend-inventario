// Chrome del panel (sidebar + toggle). Equivale al layout repetido en el
// index.html del panel viejo (sidebar + router).
import { useEffect, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermisos } from '../hooks/usePermisos';

interface Leaf { key: string; to: string; icon: string; label: string }
/** escritura: el grupo solo sirve para escribir y se oculta al rol de lectura. */
interface Group { group: string; icon: string; items: Leaf[]; escritura?: boolean }
type NavItem = Leaf | Group;

const NAV: NavItem[] = [
  { key: 'inicio', to: '/inicio', icon: 'bi-house-door', label: 'Inicio' },
  {
    group: 'Sims', icon: 'bi-sim', items: [
      { key: 'sims', to: '/sims', icon: 'bi-sim', label: 'Sims' },
    ],
  },
  {
    group: 'Productos', icon: 'bi-box-seam', items: [
      { key: 'productos', to: '/productos', icon: 'bi-box', label: 'Productos' },
      { key: 'marcas', to: '/marcas', icon: 'bi-tag', label: 'Marcas' },
      { key: 'presentaciones', to: '/presentaciones', icon: 'bi-boxes', label: 'Presentaciones' },
      { key: 'unidades-medida', to: '/unidades-medida', icon: 'bi-rulers', label: 'Unidades de Medida' },
      { key: 'proveedores', to: '/proveedores', icon: 'bi-truck', label: 'Proveedores' },
      { key: 'lineas', to: '/lineas', icon: 'bi-diagram-2', label: 'Líneas' },
    ],
  },
  {
    group: 'Compras', icon: 'bi-cart', items: [
      { key: 'compras', to: '/compras', icon: 'bi-cart-check', label: 'Compras' },
    ],
  },
  {
    group: 'Inventarios', icon: 'bi-list-check', items: [
      { key: 'movimientos', to: '/movimientos', icon: 'bi-arrow-left-right', label: 'Movimientos de Almacén' },
      { key: 'existencias', to: '/existencias', icon: 'bi-stack', label: 'Existencias (listado)' },
      { key: 'buscar-existencias', to: '/buscar-existencias', icon: 'bi-search', label: 'Buscar Existencias' },
    ],
  },
  {
    group: 'Importadores', icon: 'bi-filetype-csv', escritura: true, items: [
      { key: 'importador', to: '/importador', icon: 'bi-file-arrow-up', label: 'Importador Inventario' },
      { key: 'importador-sims', to: '/importador-sims', icon: 'bi-sim', label: 'Importador Sims' },
    ],
  },
  {
    group: "KPI's", icon: 'bi-graph-up', items: [
      { key: 'kardex', to: '/kardex', icon: 'bi-journal-text', label: 'Kardex' },
      { key: 'dashboard', to: '/inicio', icon: 'bi-speedometer2', label: 'Dashboard' },
      { key: 'existencias-kpi', to: '/buscar-existencias', icon: 'bi-stack', label: 'Existencias' },
    ],
  },
  {
    group: 'Configuración', icon: 'bi-gear', items: [
      { key: 'empresas', to: '/empresas', icon: 'bi-building', label: 'Empresas' },
      { key: 'unidades-negocio', to: '/unidades-negocio', icon: 'bi-diagram-3', label: 'Unidades de Negocio' },
      { key: 'almacenes', to: '/almacenes', icon: 'bi-shop', label: 'Almacenes' },
      { key: 'tipos-transaccion', to: '/tipos-transaccion', icon: 'bi-arrow-repeat', label: 'Tipos Transacción' },
    ],
  },
];

interface Props {
  active?: string;
  children: ReactNode;
}

export default function AppLayout({ active, children }: Props) {
  const { user, logout } = useAuth();
  const { rol, etiquetaRol, puedeEscribir } = usePermisos();
  const nav = NAV.filter((n) => !('group' in n && n.escritura && !puedeEscribir));
  // En móvil arranca colapsado (oculto); en desktop, visible.
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768,
  );
  // Grupos abiertos: arranca con el grupo del ítem activo abierto.
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV.forEach((n) => {
      if ('group' in n && n.items.some((i) => i.key === active)) init[n.group] = true;
    });
    return init;
  });

  const toggleGroup = (g: string) => setOpen((o) => ({ ...o, [g]: !o[g] }));

  useEffect(() => {
    document.body.classList.add('inventario');
    return () => document.body.classList.remove('inventario');
  }, []);

  return (
    <div className={`layout${collapsed ? ' collapsed' : ''}`} id="layout">
      <aside className="sidebar">
        <div className="brand" aria-label="Inventario" />
        <nav className="nav flex-column">
          {nav.map((n) =>
            'group' in n ? (
              <div key={n.group}>
                <a
                  className="nav-link"
                  href="#"
                  role="button"
                  onClick={(e) => { e.preventDefault(); toggleGroup(n.group); }}
                >
                  <i className={`bi ${n.icon}`} /> {n.group}
                  <i className={`bi ${open[n.group] ? 'bi-chevron-down' : 'bi-chevron-right'} ms-auto small`} />
                </a>
                {open[n.group] && n.items.map((i) => (
                  <NavLink
                    key={i.key}
                    to={i.to}
                    className={`nav-link submenu-item${i.key === active ? ' active' : ''}`}
                  >
                    <i className={`bi ${i.icon}`} /> {i.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={n.key}
                to={n.to}
                className={`nav-link${n.key === active ? ' active' : ''}`}
              >
                <i className={`bi ${n.icon}`} /> {n.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="sidebar-footer">
          <a
            className="nav-link salir"
            href="#"
            onClick={(e) => { e.preventDefault(); logout(); }}
          >
            <i className="bi bi-box-arrow-left" /> Salir
          </a>
        </div>
      </aside>

      <button
        className="edge-toggle"
        aria-label="Mostrar u ocultar menú"
        title="Mostrar u ocultar menú"
        onClick={() => setCollapsed((c) => !c)}
      >
        <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} />
      </button>

      <div className="main">
        <header className="topbar">
          <div className="usuario-sesion" title="Usuario y rol de la sesión">
            <i className="bi bi-person-circle" />
            <span className="usuario-nombre">{user?.Nombre ?? user?.NombreUsuario ?? ''}</span>
            <span className={`rol-badge rol-${rol ?? 'ninguno'}`}>{etiquetaRol}</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
