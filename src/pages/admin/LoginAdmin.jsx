import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/shared/Logo';

const ERROR_MAP = {
  'auth/invalid-email': 'El correo ingresado no es válido.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.'
};

export default function LoginAdmin() {
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
      const cred = await login(email.trim(), password);
      // Verifica que la cuenta tenga rol de administrador antes de dejarla pasar
      const snap = await getDoc(doc(db, 'usuarios', cred.user.uid));
      if (!snap.exists() || snap.data().rol !== 'administrador') {
        await signOut(auth);
        setError('Esta cuenta no tiene permisos de administración.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(ERROR_MAP[err.code] || 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-screen">
      <div className="login-card">
        <Logo variant="dark" size={24} wordSize={14} />
        <h1>Panel de administración</h1>
        <p className="lead">Acceso exclusivo para la administración del conjunto.</p>

        {error && <div className="form-error show">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <p className="back-link">
          <a href="/login">← Volver al portal de residentes</a>
        </p>
      </div>
    </div>
  );
}
