import { useState } from 'react';
import { todayISO } from '../../utils/format';

export default function MarcarPagoModal({ onClose, onConfirm, onToast }) {
  const [fecha, setFecha] = useState(todayISO());
  const [metodo, setMetodo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm({ fechaPago: fecha, metodoPago: metodo.trim() });
      onToast('Pago registrado.');
      onClose();
    } catch (err) {
      onToast('No fue posible registrar el pago: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>Marcar como pagado</h3>
        <p className="lead">Registra la fecha y el método de pago.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Fecha de pago</label>
            <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="field">
            <label>Método de pago</label>
            <input
              type="text"
              required
              placeholder="Transferencia"
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
            />
          </div>
          <div className="modal-foot">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Confirmar pago'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
