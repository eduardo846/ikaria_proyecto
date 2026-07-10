import { useState } from 'react';
import { fmtDate, fmtPeriodo, money, isVencido } from '../../../utils/format';
import { imprimirRecibo } from '../../../utils/receiptPrint';
import ReciboModal from '../../../components/admin/ReciboModal';
import MarcarPagoModal from '../../../components/admin/MarcarPagoModal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

export default function RecibosPanel({
  recibos,
  residentes,
  residentesSeleccionables,
  crearRecibo,
  eliminarRecibo,
  marcarComoPagado,
  toast
}) {
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [pagoIdAMarcar, setPagoIdAMarcar] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function handleAbrirNuevoRecibo() {
    if (residentesSeleccionables.length === 0) {
      toast('Primero agrega al menos un residente.', true);
      return;
    }
    setShowReciboModal(true);
  }

  async function handleConfirmarEliminar() {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await eliminarRecibo(id);
      toast('Recibo eliminado.');
    } catch (err) {
      toast('No fue posible eliminar: ' + err.message, true);
    }
  }

  function handleImprimir(p) {
    const residente = residentes.find((r) => r.id === p.usuarioId);
    const ok = imprimirRecibo(p, residente);
    if (!ok) toast('El navegador bloqueó la ventana. Habilita las ventanas emergentes para imprimir.', true);
  }

  return (
    <section className="panel active">
      <div className="panel-head">
        <h2>Recibos</h2>
        <button className="btn-add" onClick={handleAbrirNuevoRecibo}>
          + Agregar recibo
        </button>
      </div>
      <div className="table-wrap scroll">
        <table className="min-w">
          <thead>
            <tr>
              <th>Residente</th>
              <th>No.</th>
              <th>Periodo</th>
              <th>Vencimiento</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recibos.map((p) => {
              const residente = residentes.find((r) => r.id === p.usuarioId);
              const vencido = isVencido(p);
              const estadoHtml =
                p.estado === 'pagado' ? (
                  <span className="badge pagado">Pagado</span>
                ) : vencido ? (
                  <span className="badge vencido">Vencido</span>
                ) : (
                  <span className="badge pendiente">Pendiente</span>
                );
              return (
                <tr key={p.id}>
                  <td>{residente ? residente.nombre : '(residente no encontrado)'}</td>
                  <td>{p.numero || '—'}</td>
                  <td>{fmtPeriodo(p.periodo)}</td>
                  <td>{fmtDate(p.fechaVencimiento)}</td>
                  <td className="amount">{money(Number(p.totalAPagar ?? 0))}</td>
                  <td>{estadoHtml}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-mini" onClick={() => handleImprimir(p)}>
                        🖨 Imprimir
                      </button>
                      {p.estado !== 'pagado' && (
                        <button className="btn-mini" onClick={() => setPagoIdAMarcar(p.id)}>
                          Marcar pagado
                        </button>
                      )}
                      <button className="btn-mini danger" onClick={() => setConfirmDeleteId(p.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {recibos.length === 0 && (
          <div className="empty-state">Aún no hay recibos registrados. Agrega el primero con el botón de arriba.</div>
        )}
      </div>

      {showReciboModal && (
        <ReciboModal
          residentes={residentesSeleccionables}
          onClose={() => setShowReciboModal(false)}
          onCreate={crearRecibo}
          onToast={toast}
        />
      )}

      {pagoIdAMarcar && (
        <MarcarPagoModal
          onClose={() => setPagoIdAMarcar(null)}
          onConfirm={(datos) => marcarComoPagado(pagoIdAMarcar, datos)}
          onToast={toast}
        />
      )}

      {confirmDeleteId && (
        <ConfirmModal
          title="Eliminar recibo"
          message="¿Eliminar este recibo? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          danger
          onConfirm={handleConfirmarEliminar}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </section>
  );
}
