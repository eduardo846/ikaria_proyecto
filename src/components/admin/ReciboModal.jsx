import { useState } from 'react';

const DESGLOSE_INICIAL = {
  saldoAnterior: 0,
  interesesMoratorios: 0,
  cuotaAdmonMes: 0,
  cuotaExtraordinaria: 0,
  multas: 0,
  retroactivo: 0,
  otros: 0
};

export default function ReciboModal({ residentes, onClose, onCreate, onToast }) {
  const [residenteId, setResidenteId] = useState(residentes[0]?.id || '');
  const [numero, setNumero] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [concepto, setConcepto] = useState('Cuota de administración');
  const [vencimiento, setVencimiento] = useState('');
  const [administrador, setAdministrador] = useState('');
  const [desglose, setDesglose] = useState(DESGLOSE_INICIAL);
  const [estado, setEstado] = useState('pendiente');
  const [fechaPago, setFechaPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function setCampo(campo, valor) {
    setDesglose((prev) => ({ ...prev, [campo]: Number(valor) || 0 }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const residente = residentes.find((r) => r.id === residenteId);
      const subtotal = Object.values(desglose).reduce((a, b) => a + b, 0);
      const recibo = {
        usuarioId: residenteId,
        numero: numero.trim(),
        torre: residente?.torre || '',
        unidad: residente?.unidad || '',
        concepto: concepto.trim(),
        periodo,
        fechaVencimiento: vencimiento,
        administrador: administrador.trim(),
        ...desglose,
        subtotal,
        totalAPagar: subtotal,
        estado,
        fechaPago: estado === 'pagado' ? fechaPago || null : null,
        metodoPago: estado === 'pagado' ? metodoPago.trim() || null : null
      };
      await onCreate(recibo);
      onToast('Recibo guardado correctamente.');
      onClose();
    } catch (err) {
      setError('No fue posible guardar el recibo: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const camposDesglose = [
    ['saldoAnterior', 'Saldo anterior'],
    ['interesesMoratorios', 'Intereses moratorios'],
    ['cuotaAdmonMes', 'Cuota admón. mes'],
    ['cuotaExtraordinaria', 'Cuota extraordinaria'],
    ['multas', 'Multas'],
    ['retroactivo', 'Retroactivo'],
    ['otros', 'Otros']
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>Agregar recibo</h3>
        <p className="lead">El subtotal y el total se calculan automáticamente.</p>
        {error && <div className="form-error show">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Residente</label>
            <select required value={residenteId} onChange={(e) => setResidenteId(e.target.value)}>
              {residentes.map((r) => {
                const detalle = [r.torre ? 'Torre ' + r.torre : null, r.unidad || null].filter(Boolean).join(' · ');
                return (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                    {detalle ? ' — ' + detalle : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>No. de documento</label>
              <input type="text" placeholder="26-1780" required value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div className="field">
              <label>Periodo</label>
              <input type="month" required value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Concepto principal</label>
              <input type="text" required value={concepto} onChange={(e) => setConcepto(e.target.value)} />
            </div>
            <div className="field">
              <label>Fecha de vencimiento</label>
              <input type="date" required value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Administrador(a)</label>
            <input
              type="text"
              placeholder="Sonia Silva Carrillo"
              value={administrador}
              onChange={(e) => setAdministrador(e.target.value)}
            />
          </div>

          <fieldset>
            <legend>Desglose (deja en 0 lo que no aplique)</legend>
            <div className="grid-2">
              {camposDesglose.map(([campo, label]) => (
                <div className="field" key={campo}>
                  <label>{label}</label>
                  <input type="number" value={desglose[campo]} onChange={(e) => setCampo(campo, e.target.value)} />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
          {estado === 'pagado' && (
            <div className="grid-2">
              <div className="field">
                <label>Fecha de pago</label>
                <input type="date" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} />
              </div>
              <div className="field">
                <label>Método de pago</label>
                <input
                  type="text"
                  placeholder="Transferencia"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="modal-foot">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar recibo'}
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
