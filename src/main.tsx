// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // <-- Verifica la ruta correcta
import "./index.css"; // Si usas Tailwind o estilos globales

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
