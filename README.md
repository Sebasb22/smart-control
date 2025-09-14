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
