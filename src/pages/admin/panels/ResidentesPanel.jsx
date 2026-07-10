import { useState } from 'react';
import ResidenteModal from '../../../components/admin/ResidenteModal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

export default function ResidentesPanel({ residentes, crearResidente, eliminarResidente, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmUid, setConfirmUid] = useState(null);

  async function handleConfirmarEliminar() {
    const uid = confirmUid;
    setConfirmUid(null);
    try {
      await eliminarResidente(uid);
      toast('Perfil eliminado.');
    } catch (err) {
      toast('No fue posible eliminar: ' + err.message, true);
    }
  }

  return (
    <section className="panel active">
      <div className="panel-head">
        <h2>Residentes</h2>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          + Agregar residente
        </button>
      </div>
      <div className="table-wrap scroll">
        <table className="min-w">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Torre</th>
              <th>Unidad</th>
              <th>Correo</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {residentes.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre || '—'}</td>
                <td>{r.torre || '—'}</td>
                <td>{r.unidad || '—'}</td>
                <td>{r.email || '—'}</td>
                <td>{r.rol || 'residente'}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn-mini danger" onClick={() => setConfirmUid(r.id)}>
                      Eliminar perfil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {residentes.length === 0 && (
          <div className="empty-state">Aún no hay residentes registrados. Agrega el primero con el botón de arriba.</div>
        )}
      </div>

      {showModal && (
        <ResidenteModal onClose={() => setShowModal(false)} onCreate={crearResidente} onToast={toast} />
      )}

      {confirmUid && (
        <ConfirmModal
          title="Eliminar residente"
          message="¿Eliminar el perfil de este residente? Esto no elimina su acceso de inicio de sesión, solo sus datos. Los recibos asociados quedarán huérfanos."
          confirmLabel="Eliminar"
          danger
          onConfirm={handleConfirmarEliminar}
          onCancel={() => setConfirmUid(null)}
        />
      )}
    </section>
  );
}
