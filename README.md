# 💸 Smart Control - Gastos App

![Smart Control Banner](https://user-images.githubusercontent.com/placeholder/banner.png)

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Firebase-9.0-ffca28?logo=firebase" />
  <img src="https://img.shields.io/badge/TypeScript-4.0-3178c6?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-4.0-646cff?logo=vite" />
</p>

## 🚀 Descripción

**Smart Control** es una aplicación web moderna para la gestión de finanzas personales, ahorros y gastos. Permite llevar el control de tus cuentas, visualizar proyecciones, registrar movimientos y mantener tus finanzas organizadas de forma profesional y segura.

---

## 🧩 Tecnologías principales

- ⚛️ **React** + **TypeScript**
- 🎨 **Tailwind CSS** para estilos modernos y responsivos
- 🔥 **Firebase** (Auth + Firestore)
- ⚡ **Vite** para desarrollo ultra-rápido

---

## ✨ Funcionalidades

- 📊 Dashboard de resumen financiero
- 💰 Registro y seguimiento de ahorros
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

## 🔑 Configuración Firebase

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

## 🧑‍💻 Estructura del proyecto

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

## 🦾 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerencias, mejoras o reportar bugs.

---

## 📄 Licencia

MIT © [Sebasb22](https://github.com/Sebasb22)

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/app-preview.png" width="600" />
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

💡 Recomendaciones automáticas

Usar reglas simples:

"Tu gasto en entretenimiento aumentó un 20% este mes."

"Si ahorras $200.000 más, cumplirás tu meta antes de la fecha límite."

Más adelante podrías aplicar Machine Learning con modelos simples en Python.

3. Funciones sociales / colaborativas

Si quieres que sea más que una app personal:

👥 Cuentas compartidas

Parejas, familias o roommates pueden compartir una cuenta y registrar gastos conjuntos.

Cada usuario ve quién agregó cada gasto.

💬 Notas y comentarios

Añadir comentarios a gastos o metas.

Ejemplo: "Este gasto fue por la cena del cumpleaños de Camila."

🏆 Retos de ahorro gamificados

Crear desafíos como: "Ahorrar $500.000 este mes".

Progreso visual y recompensas virtuales.

4. Integraciones externas

Para automatizar y conectar tu app con otras herramientas:

🏦 Integración bancaria (futuro avanzado)

Conectar la app con APIs bancarias para importar gastos automáticamente.

Esto depende de la regulación en Colombia (Open Banking).

📱 Sincronización con Google Calendar

Programar recordatorios de pagos recurrentes.

💼 Exportación de datos

Exportar gastos a Excel o PDF.

Ideal para reportes financieros.

💳 Métodos de pago integrados

---

## 🔮 Futuras Actualizaciones

- 💳 **Pagos integrados:** Integrar Stripe o PayU para permitir el pago de deudas y metas directamente desde la app.

- 🌙 **Modo oscuro:** Tema claro/oscuro con persistencia personalizada por usuario para mayor comodidad visual.

- 📲 **PWA (Progressive Web App):** Instala la app como aplicación móvil desde el navegador y trabaja offline gracias a service workers.

- 🎙 **Asistente de voz:** Registra gastos automáticamente usando comandos de voz como "Gasté 50.000 en transporte y 25.000 en comida" mediante la Web Speech API.

- 📈 **Analytics y métricas:** Integrar Google Analytics o Mixpanel para analizar el comportamiento de los usuarios y mejorar la experiencia.

- 🚀 **Notificaciones push:** Recibe avisos de gastos recurrentes, metas cumplidas y alertas de sobre gasto en tiempo real.

- 📢 **Centro de anuncios:** Visualiza actualizaciones importantes de la app y tips financieros directamente en la interfaz.
