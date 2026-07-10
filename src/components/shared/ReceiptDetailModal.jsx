import { useEffect, useState } from 'react';
import { fmtDate, fmtPeriodo, money, total, isVencido } from '../../utils/format';
import { imprimirRecibo } from '../../utils/receiptPrint';
import Logo from './Logo';
import InfoModal from './InfoModal';

export default function ReceiptDetailModal({ pago, residente, onClose }) {
  const [showBlockedInfo, setShowBlockedInfo] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!pago) return null;

  const vencido = isVencido(pago);

  const filas = [
    ['Saldo anterior', pago.saldoAnterior],
    ['Intereses moratorios', pago.interesesMoratorios],
    ['Cuota admón. mes', pago.cuotaAdmonMes],
    ['Cuota extraordinaria', pago.cuotaExtraordinaria],
    ['Multas', pago.multas],
    ['Retroactivo', pago.retroactivo],
    ['Otros', pago.otros]
  ];
  const hayDesglose = filas.some(([, val]) => val !== undefined && val !== null);

  let statusClass = 'is-pendiente';
  let statusText = `Pendiente · vence el ${fmtDate(pago.fechaVencimiento)}`;
  if (pago.estado === 'pagado') {
    statusClass = 'is-pagado';
    statusText = `Pagado el ${fmtDate(pago.fechaPago)}${pago.metodoPago ? ' · ' + pago.metodoPago : ''}`;
  } else if (vencido) {
    statusClass = 'is-vencido';
    statusText = `Vencido desde el ${fmtDate(pago.fechaVencimiento)}`;
  }

  return (
    <div
      className="receipt-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="receipt-card" role="dialog" aria-modal="true">
        <button className="receipt-close" aria-label="Cerrar" onClick={onClose}>
          ✕
        </button>

        <div className="receipt-head">
          <Logo variant="dark" size={24} wordSize={13} />
          <span className="receipt-head__no">No. {pago.numero || '—'}</span>
        </div>
        <p className="receipt-subtitle">
          Documento equivalente cuenta de cobro · Expensas comunes obligatorias (Ley 675 de 2001)
        </p>

        <div className="receipt-meta">
          <div>
            <span>Torre</span>
            <strong>{pago.torre || residente?.torre || '—'}</strong>
          </div>
          <div>
            <span>Apartamento</span>
            <strong>{pago.unidad || residente?.unidad || '—'}</strong>
          </div>
          <div>
            <span>Periodo</span>
            <strong>{fmtPeriodo(pago.periodo)}</strong>
          </div>
          <div>
            <span>Vencimiento</span>
            <strong>{fmtDate(pago.fechaVencimiento)}</strong>
          </div>
        </div>

        <table className="receipt-table">
          <thead>
            <tr className="receipt-table__head">
              <td>Descripción del pago</td>
              <td>$</td>
            </tr>
          </thead>
          <tbody>
            {hayDesglose ? (
              <>
                {filas.map(([label, val]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{money(val || 0)}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Subtotal</strong>
                  </td>
                  <td>
                    <strong>{money(pago.subtotal ?? total(pago))}</strong>
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td>{pago.concepto || 'Concepto'}</td>
                <td>{money(total(pago))}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="receipt-total">
              <td>Total a pagar</td>
              <td className="amount">{money(total(pago))}</td>
            </tr>
          </tfoot>
        </table>

        <div className={`receipt-status ${statusClass}`}>{statusText}</div>

        {pago.administrador && <p className="receipt-admin">Administrador(a): {pago.administrador}</p>}

        <button
          className="btn-print-receipt"
          onClick={() => {
            const ok = imprimirRecibo(pago, residente);
            if (!ok) setShowBlockedInfo(true);
          }}
        >
          🖨 Imprimir recibo
        </button>

        {showBlockedInfo && (
          <InfoModal
            title="Ventana bloqueada"
            message="El navegador bloqueó la ventana. Habilita las ventanas emergentes para imprimir."
            onClose={() => setShowBlockedInfo(false)}
          />
        )}
      </div>
    </div>
  );
}
