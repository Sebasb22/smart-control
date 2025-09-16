# 💸 Smart Control - Gastos App

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/banner.png" alt="Smart Control Banner" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Firebase-9.0-ffca28?logo=firebase" />
  <img src="https://img.shields.io/badge/TypeScript-4.0-3178c6?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-4.0-646cff?logo=vite" />
</p>

## 🚀 Descripción

**Smart Control** es una aplicación web moderna y profesional para la gestión de finanzas personales, ahorros y gastos. Permite llevar el control de tus cuentas, visualizar proyecciones, registrar movimientos y mantener tus finanzas organizadas de forma segura y eficiente.

---

## 🧩 Tecnologías principales

- ⚛️ **React** + **TypeScript**
- 🎨 **Tailwind CSS** (estilos modernos y responsivos)
- 🔥 **Firebase** (Auth + Firestore)
- ⚡ **Vite** (desarrollo ultra-rápido)

---

## ✨ Funcionalidades principales

- 📊 Dashboard de resumen financiero
- 💰 Registro y seguimiento de ahorros y deudas
- 📝 Historial de movimientos
- 🔒 Autenticación con Google y correo
- 📱 Diseño 100% responsive (móvil, tablet, desktop)
- 📈 Proyección de inversiones y metas
- 🧹 Migración automática de datos duplicados

---

## 🛠️ Instalación y uso

```bash
# Clona el repositorio
$ git clone https://github.com/Sebasb22/smart-control.git

# Instala dependencias
$ cd my-gastos
$ npm install

# Inicia el servidor de desarrollo
$ npm run dev
```

---

## 🔑 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita Firestore y Authentication (Google y Email/Password).
3. Copia tu configuración en `src/firebase/config.ts`:

```ts
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

---

## �️ Estructura del proyecto

```
my-gastos/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── firebase/
│   ├── services/
│   ├── views/
│   ├── App.tsx
│   ├── index.css
│   └── ...
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📝 Scripts útiles

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Compila la app para producción
- `npm run lint` — Linting de código

---

## � Contribuciones

Las contribuciones son bienvenidas. Abre un issue o pull request para sugerencias, mejoras o reportar bugs.

---

## 📄 Licencia

MIT © [Sebasb22](https://github.com/Sebasb22)

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/app-preview.png" width="600" alt="Smart Control App Preview" />
</p>

## Futuras Actualiaciones (Features)

1. Mejorar lo actual (core)

Estas mejoras se centran en fortalecer lo que ya tienes:

📌 Categorías personalizables

Permitir que el usuario cree y edite categorías como: Alimentación, Transporte, Entretenimiento, etc.

Íconos y colores para identificar cada categoría.

💰 Objetivos de ahorro avanzados

Poder definir múltiples metas de ahorro con fecha límite.

Mostrar barra de progreso y porcentaje.

Notificaciones cuando esté cerca de cumplir la meta.

🔒 Seguridad

Verificación en dos pasos (2FA) usando correo o SMS.

Gestión de sesiones activas (cerrar sesión en otros dispositivos).

📩 Recuperación de contraseña personalizada

En lugar de usar la página de Firebase, crear tu propio flujo de:

Ingresar código recibido por correo.

Definir nueva contraseña directamente en tu app.

2. Funcionalidades de análisis

Para que el usuario tenga insights sobre sus finanzas:

📊 Dashboard avanzado

Gráficas interactivas con librerías como Recharts o Chart.js.

Filtros por mes, semana, categoría o método de pago.

📈 Reportes inteligentes

Comparación entre meses.

Mostrar el gasto promedio diario, semanal y mensual.

Identificar en qué categorías se gasta más.

---

## � Futuras Actualizaciones

- 📌 **Categorías personalizables:** Crea y edita categorías con íconos y colores.
- 💰 **Metas de ahorro avanzadas:** Múltiples objetivos, barra de progreso y notificaciones.
- 🔒 **Seguridad:** 2FA, gestión de sesiones y recuperación de contraseña personalizada.
- 📊 **Dashboard avanzado:** Gráficas interactivas, filtros y reportes inteligentes.
- 💡 **Recomendaciones automáticas:** Tips y alertas basados en tus hábitos financieros.
- 👥 **Cuentas compartidas:** Gastos colaborativos para familias, parejas o roommates.
- 💬 **Notas y comentarios:** Añade contexto a tus gastos y metas.
- 🏆 **Retos gamificados:** Desafíos de ahorro con recompensas virtuales.
- 🏦 **Integración bancaria:** Importa gastos automáticamente (Open Banking futuro).
- 📱 **Sincronización con Google Calendar:** Recordatorios de pagos recurrentes.
- 💼 **Exportación de datos:** Descarga tus gastos en Excel o PDF.
- 💳 **Pagos integrados:** Stripe o PayU para pagar deudas y metas.
- � **Modo oscuro:** Tema claro/oscuro con persistencia por usuario.
- 📲 **PWA:** Instala la app como móvil y trabaja offline.
- 🎙 **Asistente de voz:** Registra gastos usando comandos de voz.
- 📈 **Analytics:** Google Analytics/Mixpanel para métricas y mejoras.
- 🚀 **Notificaciones push:** Avisos de gastos, metas y alertas en tiempo real.
- 📢 **Centro de anuncios:** Actualizaciones y tips financieros en la interfaz.
  🏦 Integración bancaria (futuro avanzado)

Conectar la app con APIs bancarias para importar gastos automáticamente.
