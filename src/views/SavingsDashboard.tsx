// src/views/SavingsDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  listenToUserSavings,
  addSaving,
  updateSaving,
} from "../services/savingsService";
import type { User } from "firebase/auth";
import SavingsView, { type SavingGoal } from "./SavingsView";

interface Props {
  currentUser: User;
}

const SavingsDashboard: React.FC<Props> = ({ currentUser }) => {
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [selectedSaving, setSelectedSaving] = useState<SavingGoal | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = listenToUserSavings(currentUser.uid, setSavings);
    return unsubscribe;
  }, [currentUser]);

  const handleAddSaving = async () => {
    const newSaving: SavingGoal = {
      id: "", // Firebase generará el ID
      objetivo: "Nuevo ahorro",
      descripcion: "",
      montoObjetivo: 0,
      montoAhorrado: 0,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaObjetivo: new Date().toISOString().split("T")[0],
      historial: [],
    };
    const id = await addSaving({ ...newSaving, userId: currentUser.uid });
    setSelectedSaving({ ...newSaving, id });
  };

  const handleSelectSaving = (saving: SavingGoal) => {
    setSelectedSaving(saving);
  };

  const handleUpdateSaving = async (goal: SavingGoal) => {
    if (!goal.id) return;
    await updateSaving(goal.id, goal);
    // Actualizamos la lista principal en tiempo real
    setSavings((prev) =>
      prev.map((s) => (s.id === goal.id ? { ...s, ...goal } : s))
    );
    setSelectedSaving((prev) => ({ ...goal })); // fuerza re-render y muestra el ahorro actualizado
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mis Ahorros</h2>

      <button
        onClick={handleAddSaving}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Agregar Ahorro
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savings.map((saving) => (
          <div
            key={saving.id}
            onClick={() => handleSelectSaving(saving)}
            className="p-4 border rounded-lg cursor-pointer hover:shadow-lg"
          >
            <h3 className="font-semibold">{saving.objetivo}</h3>
            <p>Ahorrado: ${saving.montoAhorrado}</p>
            <p>Objetivo: ${saving.montoObjetivo}</p>
            <p>
              Estado:{" "}
              {saving.montoAhorrado >= saving.montoObjetivo
                ? "Cumplido"
                : "En progreso"}
            </p>
          </div>
        ))}
      </div>

      {selectedSaving && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Detalle del Ahorro</h3>
          <SavingsView
            currentUser={currentUser}
            initialSaving={selectedSaving}
            onSave={handleUpdateSaving}
          />
        </div>
      )}
    </div>
  );
};

export default SavingsDashboard;
