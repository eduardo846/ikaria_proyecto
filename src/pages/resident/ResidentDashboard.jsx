import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResidentPayments } from '../../hooks/useResidentPayments';
import { fmtDate, fmtPeriodo, money, total, isVencido } from '../../utils/format';
import Logo from '../../components/shared/Logo';
import ReceiptDetailModal from '../../components/shared/ReceiptDetailModal';

export default function ResidentDashboard() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { pagosById, pendientes, realizados, saldoPendiente, totalPagado, proximo } = useResidentPayments(
    currentUser?.uid
  );
  const [receiptId, setReceiptId] = useState(null);

  const nombre = profile?.nombre || currentUser?.email || '';
  const unidad = [profile?.torre ? 'Torre ' + profile.torre : null, profile?.unidad].filter(Boolean).join(' · ') || 'Sin asignar';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const receiptPago = receiptId ? pagosById[receiptId] : null;

  return (
    <div id="appShell">
      <header className="topbar">
        <Logo variant="light" size={26} wordSize={15} />
        <div className="topbar__right">
          <span className="topbar__unit">{unidad}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <div className="page-head">
          <div className="page-head__eyebrow">Estado de cuenta</div>
          <h1>Hola, {nombre.split(' ')[0]}</h1>
          <p>Este es el resumen de pagos de tu unidad, actualizado en tiempo real.</p>
        </div>

        <section className="summary-grid">
          <div className="summary-card owed">
            <div className="summary-card__bar" />
            <div className="summary-card__label">Saldo pendiente</div>
            <div className="summary-card__value owed">{money(saldoPendiente)}</div>
            <div className="summary-card__meta">
              {pendientes.length
                ? `${pendientes.length} ${pendientes.length === 1 ? 'cuenta por pagar' : 'cuentas por pagar'}`
                : 'Sin saldo pendiente'}
            </div>
          </div>
          <div className="summary-card next">
            <div className="summary-card__bar" />
            <div className="summary-card__label">Próximo vencimiento</div>
            <div className="summary-card__value">{proximo ? fmtDate(proximo.fechaVencimiento) : '—'}</div>
            <div className="summary-card__meta">
              {proximo
                ? isVencido(proximo)
                  ? 'Vencido · ' + proximo.concepto
                  : proximo.concepto
                : 'No hay pagos próximos'}
            </div>
          </div>
          <div className="summary-card paid">
            <div className="summary-card__bar" />
            <div className="summary-card__label">Total pagado</div>
            <div className="summary-card__value paid">{money(totalPagado)}</div>
            <div className="summary-card__meta">
              {realizados.length
                ? `${realizados.length} ${realizados.length === 1 ? 'pago registrado' : 'pagos registrados'}`
                : 'Aún sin historial'}
            </div>
          </div>
        </section>

        <section className="section pending">
          <div className="section__head">
            <h2>
              <span className="dot pending" />
              Pagos pendientes
            </h2>
            <span className="section__count">{pendientes.length}</span>
          </div>
          <div className="table-wrap scroll">
            <table className="responsive-stack">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Concepto</th>
                  <th>Periodo</th>
                  <th>Vencimiento</th>
                  <th>Total a pagar</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((p) => {
                  const vencido = isVencido(p);
                  return (
                    <tr key={p.id}>
                      <td data-label="No.">{p.numero || '—'}</td>
                      <td data-label="Concepto">{p.concepto || '—'}</td>
                      <td data-label="Periodo">{fmtPeriodo(p.periodo)}</td>
                      <td data-label="Vencimiento">{fmtDate(p.fechaVencimiento)}</td>
                      <td data-label="Total a pagar" className="amount">
                        {money(total(p))}
                      </td>
                      <td data-label="Estado">
                        <span className={`badge ${vencido ? 'vencido' : 'pendiente'}`}>
                          <span className="dot" />
                          {vencido ? 'Vencido' : 'Pendiente'}
                        </span>
                      </td>
                      <td data-label="">
                        <button className="btn-detail" onClick={() => setReceiptId(p.id)}>
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {pendientes.length === 0 && (
              <div className="empty-state">
                <strong>Estás al día 🎉</strong>
                No tienes pagos pendientes por realizar en este momento.
              </div>
            )}
          </div>
        </section>

        <section className="section done">
          <div className="section__head">
            <h2>
              <span className="dot done" />
              Pagos realizados
            </h2>
            <span className="section__count">{realizados.length}</span>
          </div>
          <div className="table-wrap scroll">
            <table className="responsive-stack">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Concepto</th>
                  <th>Periodo</th>
                  <th>Fecha de pago</th>
                  <th>Total pagado</th>
                  <th>Método</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {realizados.map((p) => (
                  <tr key={p.id}>
                    <td data-label="No.">{p.numero || '—'}</td>
                    <td data-label="Concepto">{p.concepto || '—'}</td>
                    <td data-label="Periodo">{fmtPeriodo(p.periodo)}</td>
                    <td data-label="Fecha de pago">{fmtDate(p.fechaPago)}</td>
                    <td data-label="Total pagado" className="amount">
                      {money(total(p))}
                    </td>
                    <td data-label="Método">{p.metodoPago || '—'}</td>
                    <td data-label="">
                      <button className="btn-detail" onClick={() => setReceiptId(p.id)}>
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {realizados.length === 0 && (
              <div className="empty-state">
                <strong>Aún no hay pagos registrados</strong>
                Cuando la administración registre un pago, aparecerá en esta sección.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-foot">Ikaria · Portal de residentes</footer>

      {receiptPago && <ReceiptDetailModal pago={receiptPago} residente={profile} onClose={() => setReceiptId(null)} />}
    </div>
  );
}
