import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/* =============================================================
   CONFIGURACIÓN DE FIREBASE
   Mismo proyecto usado por ikaria.html / admin.html.
   Si cambias de proyecto de Firebase, actualiza estos valores en
   https://console.firebase.google.com → Configuración del proyecto → SDK
   ============================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyB0FoRrjXerlrEcVuNfrcqaBnPr1dpWFBE",
  authDomain: "ikaria-b94ca.firebaseapp.com",
  projectId: "ikaria-b94ca",
  storageBucket: "ikaria-b94ca.firebasestorage.app",
  messagingSenderId: "596420417472",
  appId: "1:596420417472:web:a5ad1998a3579bcd69da25",
  measurementId: "G-RZHYNB0JFC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* App secundaria: permite al panel admin crear cuentas de Authentication
   para nuevos residentes SIN cerrar la sesión del administrador actual. */
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
export const secondaryAuth = getAuth(secondaryApp);
