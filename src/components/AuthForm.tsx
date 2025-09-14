// src/components/AuthForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
} from "../services/authService";

interface AuthFormProps {
  // opcional: si quieres manejar login inmediatamente via callback
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setError(null);
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        // registrar
        await registerWithEmail(
          email.trim(),
          password,
          name.trim() || undefined
        );
        // La sesión se iniciará automáticamente; onAuthStateChanged en App la detectará
      } else {
        // login
        await loginWithEmail(email.trim(), password);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error con Google Sign-In.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.svg" alt="Smart Control Logo" className="h-12 mb-2" />
          <h2 className="text-2xl font-light text-center text-blue-600 tracking-tight">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-light text-gray-500 mb-1 tracking-tight">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Tu nombre (opcional)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-light text-gray-500 mb-1 tracking-tight">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-500 mb-1 tracking-tight">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-light tracking-tight"
          >
            {loading
              ? "Procesando..."
              : mode === "login"
              ? "Entrar"
              : "Registrar"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <hr className="flex-1" />
          <span className="text-sm font-light text-gray-400 tracking-tight">
            o
          </span>
          <hr className="flex-1" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full px-3 py-2 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition font-light tracking-tight"
        >
          <FcGoogle className="text-blue-700" />
          <span>Continuar con Google</span>
        </button>

        <p className="mt-4 text-sm text-center text-gray-500 font-light tracking-tight">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 font-light hover:underline tracking-tight"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;
