import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas según sesión activa y, opcionalmente, rol de administrador.
 *
 * requireAdmin = true  -> solo usuarios con profile.rol === 'administrador'
 * requireAdmin = false -> cualquier usuario autenticado (residente o admin)
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div id="loadOverlay">
        <div className="spinner" />
        <p>Cargando…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
