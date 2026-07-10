/**
 * Modal informativo de un solo botón, mismo estilo visual que el resto.
 * Reemplaza al alert() nativo del navegador.
 */
export default function InfoModal({ title = 'Aviso', message, buttonLabel = 'Entendido', onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>{title}</h3>
        <p className="lead">{message}</p>
        <div className="modal-foot">
          <button type="button" className="btn-primary" onClick={onClose}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
