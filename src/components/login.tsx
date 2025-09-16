// src/components/Login.tsx
import { useState } from "react";
import {
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  // 🔹 Login con correo y contraseña
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      onLogin(result.user);
    } catch (err: any) {
      setLoginError("Correo o contraseña incorrectos");
    }
  };

  // 🔹 Login con Google
  const handleGoogleLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );
      const loggedUser: User = result.user;
      setUser(loggedUser);

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
      }

      onLogin(loggedUser);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔹 Enviar correo de recuperación
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMsg("Por favor ingresa tu correo.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMsg("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err: any) {
      setResetMsg("Error: " + (err.message || "No se pudo enviar el correo."));
    }
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

            <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-500 mt-2 mb-8">
              Administra tus finanzas fácilmente
            </p>

            {/* FORMULARIO LOGIN */}
            <form onSubmit={handleEmailLogin} className="mb-2">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2"
                required
              />
              {loginError && (
                <p className="text-red-500 text-sm mb-2">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2"
              >
                Iniciar sesión
              </button>
            </form>

            {/* 🔹 Botón para mostrar recuperación */}
            <button
              onClick={() => setShowReset(true)}
              className="mb-4 text-sm text-blue-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>

            {/* BOTÓN GOOGLE */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-3 bg-white border border-gray-300 rounded-lg px-5 py-3 font-medium text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200"
            >
              <FcGoogle size={22} />
              Iniciar sesión con Google
            </button>

            {/* 🔹 Modal Recuperación */}
            {showReset && (
              <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">
                  Recuperar contraseña
                </h3>
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  onClick={handlePasswordReset}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
                >
                  Enviar correo de recuperación
                </button>
                {resetMsg && (
                  <p className="mt-2 text-sm text-blue-700">{resetMsg}</p>
                )}
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetEmail("");
                    setResetMsg("");
                  }}
                  className="mt-2 text-xs text-gray-500 hover:underline"
                >
                  Cancelar
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Vista después de login */}
            <h2 className="text-2xl font-semibold text-gray-800">
              Hola, {user.displayName || "Usuario"} 👋
            </h2>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>

            <div className="flex justify-center mb-6">
              <img
                src={user.photoURL || "https://via.placeholder.com/80"}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-md"
              />
            </div>

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
};

export default Login;
