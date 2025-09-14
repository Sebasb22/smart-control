import React, { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { listenToAuthChanges } from "./services/authListener";
import { logoutUser } from "./services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/config";

import AuthForm from "./components/AuthForm";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import DashboardSummary from "./components/dashboard/DashboardSummary";
import Navbar from "./components/Navbar";
import InvestmentProjection from "./views/InvestmentProjection";
import SavingsView from "./views/SavingsView";
import DebtsView from "./views/DebtsView";
interface AppUser extends User {
  nombre?: string | null;
}

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // ✅ Mantiene sesión activa y sincronizada
  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      if (user) {
        // Traer nombre desde Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUser({ ...user, nombre: userSnap.data().nombre });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  // Manejo de logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!currentUser) {
    return <AuthForm onSuccess={() => console.log("Login exitoso")} />;
  }

  return (
    <Router>
      <div className="h-screen flex flex-col">
        {/* Navbar con información del usuario */}
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Contenido principal */}
        <div className="p-6 mt-4">
          <Routes>
            {/* Vista Dashboard */}
            <Route
              path="/"
              element={
                <>
                  <div className="mb-6 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-tight text-center">
                      ¡Bienvenido a{" "}
                      <span className="text-blue-600">Smart Control</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-light text-center tracking-tight">
                      Hola,{" "}
                      <span className="font-light text-blue-700 tracking-tight">
                        {currentUser.nombre ||
                          currentUser.displayName ||
                          "Usuario"}
                      </span>
                      <br />
                      Tu app financiera personal para controlar tus gastos e
                      ingresos.
                    </p>
                  </div>

                  {/* Resumen financiero */}
                  <DashboardSummary userId={currentUser.uid} />

                  {/* Formulario para agregar transacciones */}
                  <AddTransaction userId={currentUser.uid} />

                  {/* Listado de transacciones */}
                  <TransactionList userId={currentUser.uid} />
                </>
              }
            />

            {/* Vista Proyección de Inversión */}
            <Route path="/projection" element={<InvestmentProjection />} />
            <Route
              path="/savings"
              element={<SavingsView currentUser={currentUser} />}
            />
            <Route
              path="/debts"
              element={<DebtsView currentUser={currentUser} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
