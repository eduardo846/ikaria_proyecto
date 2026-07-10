import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginResident from './pages/resident/LoginResident';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import LoginAdmin from './pages/admin/LoginAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Portal de residentes */}
          <Route path="/login" element={<LoginResident />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Panel de administración */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Cualquier otra ruta vuelve al portal de residentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
