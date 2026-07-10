import { useEffect, useMemo, useState } from 'react';
import { fmtDate, money } from '../../../utils/format';
import Logo from '../../../components/shared/Logo';

function rangoPorDefecto() {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);
  return { inicioMes, finMes };
}

export default function ReportesPanel({ recibos, residentes }) {
  const { inicioMes, finMes } = rangoPorDefecto();
  const [desde, setDesde] = useState(inicioMes);
  const [hasta, setHasta] = useState(finMes);
  const [generadoFecha, setGeneradoFecha] = useState('');

  useEffect(() => {
    setGeneradoFecha(new Date().toLocaleString('es-ES'));
  }, [desde, hasta]);

  const { pendientesRows, solventesRows, totalPendiente, totalRecaudado } = useMemo(() => {
    const enRango = recibos.filter((p) => p.fechaVencimiento && p.fechaVencimiento >= desde && p.fechaVencimiento <= hasta);

    const porResidente = {};
    enRango.forEach((p) => {
      if (!porResidente[p.usuarioId]) {
        porResidente[p.usuarioId] = { pendiente: 0, pagado: 0, nPendientes: 0, nPagados: 0 };
      }
      const monto = Number(p.totalAPagar ?? 0);
      if (p.estado === 'pagado') {
        porResidente[p.usuarioId].pagado += monto;
        porResidente[p.usuarioId].nPagados += 1;
      } else {
        porResidente[p.usuarioId].pendiente += monto;
        porResidente[p.usuarioId].nPendientes += 1;
      }
    });

    const pendientesRows = [];
    const solventesRows = [];
    let totalPendiente = 0;
    let totalRecaudado = 0;

    Object.entries(porResidente).forEach(([uid, datos]) => {
      const residente = residentes.find((r) => r.id === uid);
      totalPendiente += datos.pendiente;
      totalRecaudado += datos.pagado;
      if (datos.pendiente > 0) {
        pendientesRows.push({ residente, ...datos });
      } else if (datos.nPagados > 0) {
        solventesRows.push({ residente, ...datos });
      }
    });

    pendientesRows.sort((a, b) => b.pendiente - a.pendiente);
    solventesRows.sort((a, b) => (a.residente?.nombre || '').localeCompare(b.residente?.nombre || ''));

    return { pendientesRows, solventesRows, totalPendiente, totalRecaudado };
  }, [recibos, residentes, desde, hasta]);

  return (
    <section className="panel active">
      <div id="reportPrintArea">
        <div className="report-print-head">
          <Logo variant="dark" size={24} wordSize={14} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19 }}>
              Reporte de estado de cuenta
            </div>
            <div style={{ fontSize: 13, color: 'var(--stone-grey)' }}>
              Del {fmtDate(desde)} al {fmtDate(hasta)}
            </div>
          </div>
        </div>

        <div className="panel-head no-print">
          <h2>Reportes</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Desde</label>
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Hasta</label>
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>
            <button className="btn-secondary" style={{ padding: '11px 18px' }} onClick={() => window.print()}>
              🖨 Imprimir
            </button>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-box owed">
            <span>Saldo pendiente total</span>
            <strong>{money(totalPendiente)}</strong>
          </div>
          <div className="summary-box paid">
            <span>Total recaudado</span>
            <strong>{money(totalRecaudado)}</strong>
          </div>
          <div className="summary-box">
            <span>Residentes con pendientes</span>
            <strong>{pendientesRows.length}</strong>
          </div>
          <div className="summary-box">
            <span>Residentes solventes</span>
            <strong>{solventesRows.length}</strong>
          </div>
        </div>

        <h3 className="report-section-title">Pendientes de pago</h3>
        <div className="table-wrap scroll" style={{ marginBottom: 32 }}>
          <table className="min-w">
            <thead>
              <tr>
                <th>Residente</th>
                <th>Torre</th>
                <th>Unidad</th>
                <th>Recibos pendientes</th>
                <th>Saldo pendiente</th>
              </tr>
            </thead>
            <tbody>
              {pendientesRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.residente ? row.residente.nombre : '(residente no encontrado)'}</td>
                  <td>{row.residente?.torre || '—'}</td>
                  <td>{row.residente?.unidad || '—'}</td>
                  <td>{row.nPendientes}</td>
                  <td className="amount">{money(row.pendiente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendientesRows.length === 0 && (
            <div className="empty-state">No hay residentes con saldo pendiente en este rango. 🎉</div>
          )}
        </div>

        <h3 className="report-section-title">Solventes (al día en el periodo)</h3>
        <div className="table-wrap scroll">
          <table className="min-w">
            <thead>
              <tr>
                <th>Residente</th>
                <th>Torre</th>
                <th>Unidad</th>
                <th>Recibos pagados</th>
                <th>Total pagado</th>
              </tr>
            </thead>
            <tbody>
              {solventesRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.residente ? row.residente.nombre : '(residente no encontrado)'}</td>
                  <td>{row.residente?.torre || '—'}</td>
                  <td>{row.residente?.unidad || '—'}</td>
                  <td>{row.nPagados}</td>
                  <td className="amount">{money(row.pagado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {solventesRows.length === 0 && (
            <div className="empty-state">Ningún residente registra pagos completos en este rango todavía.</div>
          )}
        </div>

        <p className="report-print-foot">Generado el {generadoFecha} · Ikaria, portal de administración</p>
      </div>
    </section>
  );
}
