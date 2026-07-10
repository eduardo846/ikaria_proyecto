/**
 * Modal de confirmación genérico, mismo estilo visual que el resto de modales.
 * Reemplaza al confirm() nativo del navegador.
 */
export default function ConfirmModal({
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <button className="modal-close" onClick={onCancel}>
          ✕
        </button>
        <h3>{title}</h3>
        <p className="lead">{message}</p>
        <div className="modal-foot">
          <button
            type="button"
            className="btn-primary"
            style={danger ? { background: 'var(--terracotta)' } : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
