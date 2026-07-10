import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, secondaryAuth } from '../config/firebase';

/**
 * Hook reutilizable con toda la lógica de administración: escucha en tiempo
 * real "usuarios" y "pagos", y expone las acciones CRUD que usan las
 * pantallas de admin. Aislar esto de la UI facilita reutilizarlo en
 * React Native más adelante.
 */
export function useAdminData() {
  const [residentes, setResidentes] = useState([]);
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    const qUsuarios = query(collection(db, 'usuarios'), orderBy('nombre'));
    const unsubUsuarios = onSnapshot(qUsuarios, (snap) => {
      setResidentes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubPagos = onSnapshot(collection(db, 'pagos'), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.periodo || '').localeCompare(a.periodo || ''));
      setRecibos(data);
    });

    return () => {
      unsubUsuarios();
      unsubPagos();
    };
  }, []);

  const residentesSeleccionables = useMemo(
    () => residentes.filter((r) => r.rol !== 'administrador'),
    [residentes]
  );

  /** Crea el acceso (Authentication) y el perfil (Firestore) de un residente. */
  async function crearResidente({ nombre, torre, unidad, email, password }) {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = cred.user.uid;
    await signOut(secondaryAuth);
    await setDoc(doc(db, 'usuarios', uid), { nombre, torre, unidad, email, rol: 'residente' });
  }

  async function eliminarResidente(uid) {
    await deleteDoc(doc(db, 'usuarios', uid));
  }

  async function crearRecibo(recibo) {
    await addDoc(collection(db, 'pagos'), recibo);
  }

  async function eliminarRecibo(id) {
    await deleteDoc(doc(db, 'pagos', id));
  }

  async function marcarComoPagado(id, { fechaPago, metodoPago }) {
    await updateDoc(doc(db, 'pagos', id), { estado: 'pagado', fechaPago, metodoPago });
  }

  return {
    residentes,
    recibos,
    residentesSeleccionables,
    crearResidente,
    eliminarResidente,
    crearRecibo,
    eliminarRecibo,
    marcarComoPagado
  };
}
