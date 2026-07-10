# Ikaria · Portal de Residentes y Administración

Aplicación web para la gestión de expensas comunes del conjunto residencial **Ikaria**. Permite a los residentes consultar su estado de cuenta en tiempo real, y a la administración gestionar residentes, recibos y generar reportes.

Construida con **React + Vite** y **Firebase** (Authentication + Firestore).

---

## ✨ Funcionalidades

### Portal de residentes (`/login`)
- Inicio de sesión con correo y contraseña.
- Resumen en tiempo real: saldo pendiente, próximo vencimiento y total pagado.
- Tablas de pagos **pendientes** y **realizados**.
- Modal de detalle de recibo con desglose completo.
- Recibo imprimible con el formato físico oficial (documento equivalente cuenta de cobro, Ley 675 de 2001).

### Panel de administración (`/admin/login`)
- Acceso exclusivo para cuentas con `rol: "administrador"` en Firestore.
- **Residentes**: alta de nuevos residentes (crea cuenta de Authentication + perfil en un solo paso) y eliminación de perfiles.
- **Recibos**: creación de cuentas de cobro con desglose automático, marcar como pagado, impresión individual y eliminación.
- **Reportes**: filtro por rango de fechas, resumen de saldo pendiente/recaudado, listado de residentes con pendientes y solventes, con vista de impresión.
- Confirmaciones y avisos mediante modales propios (sin `alert()`/`confirm()` nativos del navegador).

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| UI | React 18 + Vite 5 |
| Ruteo | react-router-dom v6 |
| Backend | Firebase Authentication + Cloud Firestore (tiempo real) |
| Estilos | CSS con variables (sin frameworks), responsive |

---

## 📂 Estructura del proyecto

```
src/
├── config/
│   └── firebase.js          # Configuración e inicialización de Firebase
├── context/
│   └── AuthContext.jsx      # Sesión activa + perfil del usuario (residente/admin)
├── routes/
│   └── ProtectedRoute.jsx   # Protección de rutas por sesión y rol
├── hooks/
│   ├── useResidentPayments.js  # Lógica de pagos de un residente (reutilizable)
│   └── useAdminData.js         # Lógica CRUD de administración (reutilizable)
├── utils/
│   ├── format.js            # Formato de dinero, fechas y periodos
│   └── receiptPrint.js       # Generación del recibo imprimible
├── components/
│   ├── shared/               # Logo, modales de recibo/confirmación/aviso
│   └── admin/                 # Modales de residente, recibo y marcar pago
├── pages/
│   ├── resident/              # Login y dashboard del residente
│   └── admin/                 # Login, dashboard y paneles (residentes/recibos/reportes)
├── styles/
│   └── theme.css              # Variables de marca y estilos globales
├── App.jsx                    # Definición de rutas
└── main.jsx                   # Punto de entrada
```

> La lógica de negocio vive en `hooks/` y `utils/`, separada de la UI, para poder reutilizarla en una futura versión con **React Native**.

---

## 🚀 Cómo correrlo localmente

### Requisitos
- Node.js 18 o superior
- Una cuenta con `rol: "administrador"` ya creada en la colección `usuarios` de Firestore (para entrar al panel de admin)

### Pasos

```bash
git clone <url-de-este-repositorio>
cd ikaria-web
npm install
npm run dev
```

Abre:
- `http://localhost:5173/login` → portal de residentes
- `http://localhost:5173/admin/login` → panel de administración

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |

---

## 🔥 Configuración de Firebase

La configuración vive en `src/config/firebase.js`. Si necesitas apuntar a otro proyecto de Firebase, reemplaza el objeto `firebaseConfig` con los valores de:

**Firebase Console → Configuración del proyecto → SDK de configuración**

### Modelo de datos (Firestore)

**Colección `usuarios`** — un documento por persona (residente o administrador):
```js
{
  nombre: "Kelly Andrea Serrano Castillo",
  torre: "A",
  unidad: "Apartamento 304",
  email: "apto304@ikaria.com",
  rol: "residente" // o "administrador"
}
```

**Colección `pagos`** — un documento por cuenta de cobro:
```js
{
  usuarioId: "<uid del residente>",
  numero: "26-1780",
  torre: "A",
  unidad: "Apartamento 304",
  concepto: "Cuota de administración",
  periodo: "2026-06",              // AAAA-MM
  fechaVencimiento: "2026-06-30",  // AAAA-MM-DD
  administrador: "Sonia Silva Carrillo",

  saldoAnterior: 0,
  interesesMoratorios: 0,
  cuotaAdmonMes: 197500,
  cuotaExtraordinaria: 0,
  multas: 0,
  retroactivo: 0,
  otros: 0,

  subtotal: 197500,
  totalAPagar: 197500,

  estado: "pagado" | "pendiente",
  fechaPago: "2026-05-05",     // solo si estado = pagado
  metodoPago: "Transferencia"  // solo si estado = pagado
}
```

### Reglas de seguridad recomendadas

Este proyecto asume reglas de Firestore basadas en rol (`isAdmin()`), donde:
- Un residente solo puede leer sus propios documentos en `pagos` (`usuarioId == request.auth.uid`).
- Solo cuentas con `rol == "administrador"` pueden escribir en `usuarios` y `pagos`.

---

## 🗺️ Roadmap

- [x] Migración de HTML + Firebase (vanilla JS) a React + Vite
- [x] Modales propios reemplazando `alert()`/`confirm()`
- [ ] Versión móvil con **React Native (Expo)**, reutilizando `hooks/` y `utils/`
- [ ] Code-splitting para reducir el tamaño del bundle

---

## 📄 Licencia 
Hector Ramirez
Uso interno — Conjunto Ikaria Apartamentos P.H.
