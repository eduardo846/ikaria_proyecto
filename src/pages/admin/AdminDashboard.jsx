import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../hooks/useAdminData';
import Logo from '../../components/shared/Logo';
import ResidentesPanel from './panels/ResidentesPanel';
import RecibosPanel from './panels/RecibosPanel';
import ReportesPanel from './panels/ReportesPanel';

const TABS = [
  { id: 'residentes', label: 'Residentes' },
  { id: 'recibos', label: 'Recibos' },
  { id: 'reportes', label: 'Reportes' }
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    residentes,
    recibos,
    residentesSeleccionables,
    crearResidente,
    eliminarResidente,
    crearRecibo,
    eliminarRecibo,
    marcarComoPagado
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('residentes');
  const [toastState, setToastState] = useState({ msg: '', error: false, visible: false });
  const toastTimer = useRef(null);

  const toast = useCallback((msg, isError = false) => {
    setToastState({ msg, error: isError, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((s) => ({ ...s, visible: false })), 3200);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div id="appShell">
      <header className="topbar no-print">
        <Logo variant="light" size={24} wordSize={14} tag="Administración" />
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        <div className="tabs no-print">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'residentes' && (
          <ResidentesPanel
            residentes={residentes}
            crearResidente={crearResidente}
            eliminarResidente={eliminarResidente}
            toast={toast}
          />
        )}
        {activeTab === 'recibos' && (
          <RecibosPanel
            recibos={recibos}
            residentes={residentes}
            residentesSeleccionables={residentesSeleccionables}
            crearRecibo={crearRecibo}
            eliminarRecibo={eliminarRecibo}
            marcarComoPagado={marcarComoPagado}
            toast={toast}
          />
        )}
        {activeTab === 'reportes' && <ReportesPanel recibos={recibos} residentes={residentes} />}
      </main>

      <div id="toast" className={`${toastState.visible ? 'show' : ''} ${toastState.error ? 'error' : ''}`}>
        {toastState.msg}
      </div>
    </div>
  );
}
