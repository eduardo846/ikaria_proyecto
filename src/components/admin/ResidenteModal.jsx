import { useState } from 'react';

const ERROR_MAP = {
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta creada.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.'
};

export default function ResidenteModal({ onClose, onCreate, onToast }) {
  const [nombre, setNombre] = useState('');
  const [torre, setTorre] = useState('');
  const [unidad, setUnidad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onCreate({
        nombre: nombre.trim(),
        torre: torre.trim(),
        unidad: unidad.trim(),
        email: email.trim(),
        password
      });
      onToast('Residente creado correctamente.');
      onClose();
    } catch (err) {
      setError(ERROR_MAP[err.code] || 'No fue posible crear el residente: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>Agregar residente</h3>
        <p className="lead">Se crea su acceso (correo y contraseña) y su perfil en un solo paso.</p>
        {error && <div className="form-error show">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre completo</label>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Torre</label>
              <input type="text" placeholder="A" value={torre} onChange={(e) => setTorre(e.target.value)} />
            </div>
            <div className="field">
              <label>Unidad / Apartamento</label>
              <input
                type="text"
                placeholder="Apartamento 304"
                required
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label>Correo de acceso</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Contraseña temporal</label>
            <input
              type="text"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="modal-foot">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando…' : 'Crear residente'}
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
