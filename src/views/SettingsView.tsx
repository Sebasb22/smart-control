import { useState } from "react";
import { auth } from "../firebase/config";
import { deleteUser } from "firebase/auth";
import { reauthenticateUser } from "../services/authService";
import { deleteUserData } from "../services/userService";

export default function SettingsView() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Esta acción es IRREVERSIBLE.\n\nSe eliminará tu cuenta y toda tu información, incluyendo ahorros y deudas.\n¿Deseas continuar?"
    );

    if (!confirmDelete) return;

    if (!currentUser) return;

    try {
      setLoading(true);

      // Paso 1: Reautenticar
      await reauthenticateUser(currentUser, password);

      // Paso 2: Eliminar datos del usuario en Firestore
      await deleteUserData(currentUser.uid);

      // Paso 3: Eliminar cuenta de Firebase Auth
      await deleteUser(currentUser);

      alert("✅ Cuenta eliminada correctamente.");
      setTimeout(() => {
        window.location.href = "/"; // Redirigir al home
      }, 2000);
    } catch (error: any) {
      alert(`❌ Error eliminando cuenta: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuración</h1>
      <p className="text-gray-600 mb-6">
        Administra la configuración de tu cuenta, incluyendo la opción de
        eliminar todos tus datos.
      </p>

      {currentUser?.providerData[0]?.providerId === "password" && (
        <div className="mb-4">
          <label className="block mb-2">Confirma tu contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* Zona peligrosa */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Zona Peligrosa ⚠️
        </h2>
        <p className="text-sm text-red-700 mb-4">
          Esta acción eliminará <strong>toda tu información</strong>, incluyendo
          ahorros, deudas y cualquier dato asociado a tu cuenta. Esta operación
          es irreversible.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Eliminando..." : "Eliminar cuenta y todos los datos"}
        </button>
      </div>

      {/* Mensajes */}
      {/* {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )} */}
    </div>
  );
}
