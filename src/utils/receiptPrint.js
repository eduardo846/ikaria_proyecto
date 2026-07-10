import { fmtDate, mesDeNombre } from './format';

// Datos fijos del edificio — ajusta aquí si cambian
const EDIFICIO = {
  nombre: 'CONJUNTO IKARIA APARTAMENTOS P.H.',
  nit: '901.692.977-7',
  email: 'contabilidad.ikariaconjunto@gmail.com'
};

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function construirHtmlRecibo(p, residente) {
  const [anio, mes, dia] = (p.fechaVencimiento || '').split('-');
  const nombre = residente ? residente.nombre : '—';
  const torre = p.torre || (residente && residente.torre) || '—';
  const unidad = p.unidad || (residente && residente.unidad) || '—';
  const filas = [
    ['SALDO ANTERIOR', p.saldoAnterior],
    ['INTERESES MORATORIOS', p.interesesMoratorios],
    ['SUBTOTAL', p.subtotal],
    ['CUOTA ADMÓN MES ' + mesDeNombre(p.periodo), p.cuotaAdmonMes],
    ['CUOTA EXTRAORDINARIA', p.cuotaExtraordinaria],
    ['MULTAS', p.multas],
    ['RETROACTIVO', p.retroactivo],
    ['OTROS', p.otros]
  ];
  const filasHtml = filas
    .map(
      ([label, val]) =>
        `<tr><td class="desc">${label}</td><td class="val">${val ? Number(val).toLocaleString('es-CO') : ''}</td></tr>`
    )
    .join('');

  const pieNota =
    p.estado === 'pagado' ? `Pagado el ${fmtDate(p.fechaPago)}` : `Fecha límite de pago: ${fmtDate(p.fechaVencimiento)}`;

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Recibo ${escapeHtml(p.numero || '')}</title>
<style>
  @page { size: 8.5in 5.5in; margin: 8mm; }
  *{box-sizing:border-box;}
  body{font-family:'Georgia', 'Times New Roman', serif; color:#1a1a1a; font-size:10.5px;}
  .doc{border:1.3px solid #1a1a1a; padding:10px 14px; max-width:100%; margin:0 auto;}
  .head{display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;}
  .brand{font-weight:700; font-size:13px; letter-spacing:0.03em;}
  .brand-sub{font-size:9px; margin-top:1px;}
  .venc-table{border-collapse:collapse; font-size:8.5px;}
  .venc-table td{border:1px solid #1a1a1a; padding:1.5px 6px; text-align:center;}
  .venc-table .lbl{font-weight:700; background:#f2f2f2;}
  .titles{text-align:center; margin:8px 0 7px;}
  .titles .t1{font-weight:700; font-size:11px;}
  .titles .t2{font-size:10px;}
  .titles .t3{font-size:9px;}
  .datos{margin-bottom:6px; font-size:10px; line-height:1.4;}
  .datos b{display:inline-block; width:108px; white-space:nowrap; vertical-align:top;}
  table.tabla{width:100%; border-collapse:collapse; margin-top:4px;}
  table.tabla th{background:#dedede; border:1px solid #1a1a1a; padding:2.5px 6px; font-size:9px; text-align:left;}
  table.tabla th.val{text-align:right;}
  table.tabla td{border:1px solid #1a1a1a; padding:2.5px 6px; font-size:9.5px;}
  table.tabla td.val{text-align:right; font-variant-numeric:tabular-nums; width:90px;}
  .total-row td{font-weight:700; background:#f2f2f2;}
  .box-pago{border:1.3px solid #1a1a1a; margin-top:7px; padding:5px 10px; text-align:center; font-size:10px; line-height:1.35;}
  .foot{margin-top:8px; font-size:7.5px; text-align:center; line-height:1.3; font-style:italic;}
  .foot strong{display:block; font-style:normal; font-size:8.5px; margin-top:3px;}
  @media print{ body{margin:0;} }
</style>
</head>
<body>
  <div class="doc">
    <div class="head">
      <div>
        <div class="brand">🌸 IKARIA</div>
        <div class="brand-sub">${EDIFICIO.nombre}</div>
        <div class="brand-sub">NIT.${EDIFICIO.nit}</div>
      </div>
      <table class="venc-table">
        <tr><td class="lbl">No.</td><td colspan="3">${escapeHtml(p.numero || '')}</td></tr>
        <tr><td class="lbl" colspan="4">VENCIMIENTO</td></tr>
        <tr><td class="lbl">DIA</td><td class="lbl">MES</td><td class="lbl">AÑO</td></tr>
        <tr><td>${dia || '—'}</td><td>${mes || '—'}</td><td>${anio || '—'}</td></tr>
      </table>
    </div>

    <div class="titles">
      <div class="t1">DOCUMENTO EQUIVALENTE CUENTA DE COBRO</div>
      <div class="t2">EXPENSAS COMUNES OBLIGATORIAS</div>
      <div class="t3">(Ley 675 de 2001)</div>
    </div>

    <div class="datos">
      <div><b>SEÑOR(A):</b> ${escapeHtml(nombre)}</div>
      <div><b>TORRE:</b> ${escapeHtml(torre)}</div>
      <div><b>APARTAMENTO:</b> ${escapeHtml(unidad)}</div>
    </div>

    <table class="tabla">
      <thead><tr><th>DESCRIPCIÓN DEL PAGO</th><th class="val">$</th></tr></thead>
      <tbody>
        ${filasHtml}
        <tr class="total-row"><td>TOTAL A PAGAR</td><td class="val">${Number(p.totalAPagar || 0).toLocaleString('es-CO')}</td></tr>
      </tbody>
    </table>

    <div class="box-pago">
      ${pieNota}<br>
      Administrador(a): ${escapeHtml(p.administrador || '—')}<br>
      <strong>$ ${Number(p.totalAPagar || 0).toLocaleString('es-CO')}</strong>
    </div>

    <div class="foot">
      Esta cuenta de cobro se asimila en todos sus efectos legales a una letra de cambio (Art. 621 y 774 C.Cio.)<br>
      Cualquier inquietud o novedad reportar al email: ${EDIFICIO.email}
      <strong>PAGUE ÚNICAMENTE EN PUNTOS AUTORIZADOS</strong>
    </div>
  </div>
  <script>window.onload = () => { window.print(); };<\/script>
</body></html>`;
}

/**
 * Abre una ventana nueva con el recibo formateado y dispara la impresión.
 * @param {object} pago - documento del recibo (colección "pagos")
 * @param {object|null} residente - documento del residente (colección "usuarios")
 * @returns {boolean} false si el navegador bloqueó la ventana emergente
 */
export function imprimirRecibo(pago, residente) {
  const html = construirHtmlRecibo(pago, residente);
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  return true;
}
