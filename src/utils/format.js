export const money = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(n || 0);

export const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtPeriodo = (periodo) => {
  if (!periodo) return '—';
  const [y, m] = periodo.split('-');
  if (!m) return periodo;
  const d = new Date(Number(y), Number(m) - 1, 1);
  const label = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const mesDeNombre = (periodo) => {
  if (!periodo) return '';
  const [y, m] = periodo.split('-');
  const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('es-ES', { month: 'long' });
  return label.toUpperCase();
};

export const total = (p) => Number(p?.totalAPagar ?? p?.monto ?? 0);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const isVencido = (p) => p.estado === 'pendiente' && p.fechaVencimiento && p.fechaVencimiento < todayISO();
