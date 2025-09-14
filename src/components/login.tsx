// src/components/Login.tsx
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );
      const loggedUser: User = result.user;
      setUser(loggedUser);

      // 🔹 Guardar usuario en Firestore
      const userRef = doc(db, "users", loggedUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: loggedUser.uid,
          name: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
          createdAt: new Date(),
        });
        console.log("Usuario guardado en Firestore ✅");
      } else {
        console.log("Usuario ya existe en Firestore");
      }

      onLogin(loggedUser);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-100">
        {!user ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-bold">💰</span>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-500 mt-2 mb-8">
              Administra tus finanzas fácilmente
            </p>

            {/* Botón Google */}
            <button
              onClick={handleLogin}
              className="flex items-center justify-center w-full gap-3 bg-white border border-gray-300 rounded-lg px-5 py-3 font-medium text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200"
            >
              <FcGoogle size={22} />
              Iniciar sesión con Google
            </button>

            {/* Info extra */}
            <p className="mt-6 text-xs text-gray-400">
              Al continuar, aceptas nuestros{" "}
              <span className="text-blue-500 hover:underline cursor-pointer">
                Términos y Condiciones
              </span>
              .
            </p>
          </>
        ) : (
          <>
            {/* Bienvenida */}
            <h2 className="text-2xl font-semibold text-gray-800">
              Hola, {user.displayName || "Usuario"} 👋
            </h2>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>

            {/* Foto de usuario */}
            <div className="flex justify-center mb-6">
              <img
                src={user.photoURL || "https://via.placeholder.com/80"}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-md"
              />
            </div>

            {/* Botón cerrar sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
            >
              <FiLogOut size={18} />
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
