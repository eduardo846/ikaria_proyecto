import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/shared/Logo';

const ERROR_MAP = {
  'auth/invalid-email': 'El correo ingresado no es válido.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo en unos minutos.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada por la administración.'
};

export default function LoginResident() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(ERROR_MAP[err.code] || 'No fue posible iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="loginScreen">
      <div className="login-hero">
        <svg className="dome-field" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="480" cy="120" r="16" fill="none" stroke="#D9A441" strokeWidth="1.5" opacity="0.5" />
          <path d="M 80 300 A 60 60 0 0 1 200 300 L 200 420 L 80 420 Z" fill="none" stroke="#F5F6F4" strokeWidth="1.2" opacity="0.15" />
          <path d="M 340 380 A 70 70 0 0 1 480 380 L 480 520 L 340 520 Z" fill="none" stroke="#F5F6F4" strokeWidth="1.2" opacity="0.15" />
          <path d="M 150 560 A 50 50 0 0 1 250 560 L 250 660 L 150 660 Z" fill="none" stroke="#F5F6F4" strokeWidth="1.2" opacity="0.12" />
        </svg>
        <Logo variant="light" size={30} wordSize={15} />
        <div className="login-hero__body">
          <div className="login-hero__eyebrow">Portal de residentes</div>
          <h1 className="login-hero__title">
            Tu estado de<br />
            <em>cuenta</em>, siempre<br />
            a la vista.
          </h1>
          <p className="login-hero__sub">
            Consulta pagos realizados y pendientes de tu unidad en Ikaria desde cualquier dispositivo.
          </p>
        </div>
        <svg className="wave" viewBox="0 0 600 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 Q 75 10 150 30 T 300 30 T 450 30 T 600 30 V60 H0 Z" fill="#0E2233" />
        </svg>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <div className="login-card__top">
            <Logo variant="dark" size={26} wordSize={14} />
            <h1>Ingresa a tu cuenta</h1>
            <p className="lead">Usa las credenciales asignadas por la administración.</p>
          </div>

          {error && <div className="form-error show">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                placeholder="apto301@ikaria.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="login-card__foot">
            ¿Olvidaste tu contraseña o no tienes acceso? Comunícate con la administración del edificio.
          </p>
          <p className="login-card__foot" style={{ marginTop: 8 }}>
            <a href="/admin/login" style={{ color: 'var(--aegean-mid)', fontWeight: 600, textDecoration: 'none' }}>
              ¿Eres administrador? Ingresa al panel →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
