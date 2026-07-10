import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { total } from '../utils/format';

/**
 * Hook reutilizable (web y, más adelante, React Native) con la lógica
 * de pagos de un residente: escucha en tiempo real, separa pendientes/
 * realizados y calcula los totales del resumen.
 */
export function useResidentPayments(uid) {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setPagos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'pagos'), where('usuarioId', '==', uid));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => (b.periodo || '').localeCompare(a.periodo || ''));
        setPagos(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error al leer los pagos:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  const pagosById = useMemo(() => Object.fromEntries(pagos.map((p) => [p.id, p])), [pagos]);

  const pendientes = useMemo(
    () =>
      pagos
        .filter((p) => p.estado === 'pendiente')
        .slice()
        .sort((a, b) => (a.fechaVencimiento || '').localeCompare(b.fechaVencimiento || '')),
    [pagos]
  );

  const realizados = useMemo(
    () =>
      pagos
        .filter((p) => p.estado === 'pagado')
        .slice()
        .sort((a, b) => (b.fechaPago || '').localeCompare(a.fechaPago || '')),
    [pagos]
  );

  const saldoPendiente = useMemo(() => pendientes.reduce((s, p) => s + total(p), 0), [pendientes]);
  const totalPagado = useMemo(() => realizados.reduce((s, p) => s + total(p), 0), [realizados]);
  const proximo = pendientes[0] || null;

  return { pagos, pagosById, pendientes, realizados, saldoPendiente, totalPagado, proximo, loading };
}
