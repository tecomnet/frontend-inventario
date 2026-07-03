// Login del panel de Inventario. Estilo idéntico a WebAdmin.
// La autenticación real aún no existe: el BFF opera en modo "placeholder"
// (acepta cualquier credencial y crea sesión). Cuando exista el endpoint,
// solo hay que cambiar AUTH_MODE=api en las variables del Lambda.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import NodeNetwork from '../components/NodeNetwork';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const { reload } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Marca el body para activar el fondo oscuro de login.css (scoped).
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  // Si ya hay sesión, ir directo al panel.
  useEffect(() => {
    Auth.check()
      .then((j) => { if (j.authenticated) navigate('/inicio', { replace: true }); })
      .catch(() => {});
  }, [navigate]);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    if (!email.trim() || !pass) { setError('Captura correo y contraseña.'); return; }
    setLoading(true);
    try {
      const res = await Auth.login(email.trim(), pass);
      if (res.ok && res.data.ok) {
        await reload();
        navigate('/inicio', { replace: true });
      } else {
        setError(res.data.mensaje || 'Usuario o contraseña no válida.');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NodeNetwork />
      {/* <div className="bg-glow" /> */}

      <div className="stage">
        <div className="login-card">
          <div className="logo-ring">
            <img src="/img/Mundo2.png" alt="TECOMNET" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>

          <div className="brand">
            <img src="/img/LetrasTecomnet.png" alt="TECOMNET"
              style={{ height: 44, width: 'auto', maxWidth: '100%' }}
              onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <div className="sub">Sistema de inventarios</div>

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="field-label" htmlFor="email">Correo</label>
              <div className="field">
                <i className="bi bi-envelope" />
                <input type="email" id="email" autoComplete="username" placeholder="correo@tecomnet.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="field-label" htmlFor="password">Contraseña</label>
              <div className="field">
                <i className="bi bi-shield-lock" />
                <input type={showPass ? 'text' : 'password'} id="password" autoComplete="current-password"
                  placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} required />
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} toggle`} title="Mostrar / ocultar"
                  onClick={() => setShowPass((s) => !s)} />
              </div>
            </div>

            <div className={`err${error ? ' show' : ''}`}>
              <i className="bi bi-exclamation-triangle" /> <span>{error}</span>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-1" /> Verificando…</>
                : <><i className="bi bi-box-arrow-in-right me-1" /> INGRESAR</>}
            </button>
          </form>

          <div className="foot">© TECOMNET <span className="dot">·</span> Inventario</div>
        </div>
      </div>
    </>
  );
}
