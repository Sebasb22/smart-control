import {
  FiTarget,
  FiEdit2,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import React, { useState, useEffect } from "react";
import { differenceInMonths, differenceInDays } from "date-fns";
import {
  listenToUserSavings,
  addSaving,
  updateSaving,
  deleteSaving,
} from "../services/savingsService";
import type { User } from "firebase/auth";

// Definición de SavingGoal y formatCOP
export interface SavingGoal {
  id?: string;
  objetivo: string;
  descripcion: string;
  montoObjetivo: number;
  montoAhorrado: number;
  fechaInicio: string;
  fechaObjetivo: string;
  historial: {
    fecha: string;
    cambio: number;
    comentario: string;
    id?: string;
  }[];
}

const formatCOP = (value: number) => {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

interface Props {
  currentUser: User;
  initialSaving?: SavingGoal | null;
  onSave?: (data: SavingGoal) => void;
}

const SavingsView: React.FC<Props> = ({
  currentUser,
  initialSaving = null,
  onSave,
}) => {
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [selectedSaving, setSelectedSaving] = useState<SavingGoal | null>(
    initialSaving
  );

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = listenToUserSavings(currentUser.uid, setSavings);
    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    setSelectedSaving(initialSaving);
  }, [initialSaving]);

  const handleAddSaving = async () => {
    const today = new Date().toISOString().split("T")[0];
    const newSaving: SavingGoal = {
      objetivo: "Nuevo ahorro",
      descripcion: "",
      montoObjetivo: 0,
      montoAhorrado: 0,
      fechaInicio: today,
      fechaObjetivo: today,
      historial: [],
    };
    const id = await addSaving({ ...newSaving, userId: currentUser.uid });
    setSelectedSaving({ ...newSaving, id });
    setSavings((prev) => [...prev, { ...newSaving, id }]);
  };

  const handleSave = async (data: SavingGoal) => {
    const goalToSave = {
      ...data,
      montoObjetivo: Number(data.montoObjetivo) || 0,
      montoAhorrado: Number(data.montoAhorrado) || 0,
      historial: data.historial.map((h) => ({
        fecha: h.fecha,
        cambio: Number(h.cambio),
        comentario: h.comentario || "",
        id: h.id || crypto.randomUUID(),
      })),
    };

    if (!goalToSave.id) {
      const id = await addSaving({ ...goalToSave, userId: currentUser.uid });
      const newSaving = { ...goalToSave, id };
      setSelectedSaving(null);
      setSavings((prev) => [...prev, newSaving]);
    } else {
      await updateSaving(goalToSave.id, goalToSave);
      setSelectedSaving(null);
      setSavings((prev) =>
        prev.map((s) => (s.id === goalToSave.id ? goalToSave : s))
      );
    }
  };

  const handleDelete = async (saving: SavingGoal, idx?: number) => {
    if (saving.id) {
      await deleteSaving(saving.id);
      setSelectedSaving(null);
      setSavings((prev) => prev.filter((s) => s.id !== saving.id));
    } else if (typeof idx === "number") {
      setSelectedSaving(null);
      setSavings((prev) => prev.filter((_, i) => i !== idx));
    }
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
        {savings.map((saving, idx) => (
          <div
            key={saving.id ? `${saving.id}-${idx}` : `saving-${idx}`}
            className="p-4 border rounded-lg hover:shadow-lg relative"
          >
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await handleDelete(saving, idx);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
            >
              Eliminar
            </button>
            <div
              onClick={() => setSelectedSaving(saving)}
              className="cursor-pointer"
            >
              <h3 className="font-semibold">{saving.objetivo}</h3>
              <p>Ahorrado: {formatCOP(saving.montoAhorrado)}</p>
              <p>Objetivo: {formatCOP(saving.montoObjetivo)}</p>
              <p>
                Estado:{" "}
                {saving.montoAhorrado >= saving.montoObjetivo
                  ? "Cumplido"
                  : "En progreso"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedSaving && (
        <div className="relative max-w-xl mx-auto">
          <SavingDetailView
            savingData={selectedSaving}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setSelectedSaving(null)}
          />
        </div>
      )}
    </div>
  );
};

interface DetailProps {
  savingData: SavingGoal;
  onSave: (data: SavingGoal) => void;
  onDelete: (data: SavingGoal) => void;
  onClose?: () => void;
}

const SavingDetailView: React.FC<DetailProps> = ({
  savingData,
  onSave,
  onDelete,
  onClose,
}) => {
  const [goal, setGoal] = useState<SavingGoal>(savingData);
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualType, setManualType] = useState<"ingreso" | "retiro">("ingreso");
  const [manualComment, setManualComment] = useState<string>("");

  useEffect(() => {
    setGoal(savingData);
  }, [savingData]);

  const handleManualSubmit = () => {
    if (manualAmount === 0) return;
    const cambio = manualType === "retiro" ? -manualAmount : manualAmount;
    const nuevoMonto = goal.montoAhorrado + cambio;
    const updatedGoal: SavingGoal = {
      ...goal,
      montoAhorrado: nuevoMonto,
      historial: [
        {
          fecha: new Date().toISOString(),
          cambio,
          comentario: manualComment || "",
          id: crypto.randomUUID(),
        },
        ...goal.historial.map((h) => ({
          ...h,
          id: h.id || crypto.randomUUID(),
        })),
      ],
    };
    setGoal(updatedGoal);
    onSave(updatedGoal);
    setManualAmount(0);
    setManualComment("");
    setManualType("ingreso");
  };

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-light text-gray-700 flex items-center gap-2 tracking-tight">
          <FiTarget className="inline-block text-blue-500" /> Detalle del Ahorro
        </h3>
        {onClose && (
          <button
            className="rounded-full p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 transition flex items-center justify-center"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiEdit2 className="text-gray-400" /> Nombre del ahorro
          </label>
          <input
            type="text"
            value={goal.objetivo}
            onChange={(e) => setGoal({ ...goal, objetivo: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiEdit2 className="text-gray-400" /> Descripción
          </label>
          <textarea
            value={goal.descripcion}
            onChange={(e) => setGoal({ ...goal, descripcion: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
            rows={2}
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-blue-400" /> Monto objetivo
          </label>
          <input
            type="number"
            value={goal.montoObjetivo}
            onChange={(e) => setGoal({ ...goal, montoObjetivo: Number(e.target.value) })}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition text-blue-700 font-semibold"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-green-400" /> Monto ahorrado
          </label>
          <input
            type="number"
            value={goal.montoAhorrado}
            readOnly
            className="w-full p-2 border-b border-gray-300 bg-gray-100 outline-none transition text-green-700 font-semibold"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiCalendar className="text-blue-400" /> Fecha objetivo
          </label>
          <input
            type="date"
            value={goal.fechaObjetivo}
            onChange={(e) => setGoal({ ...goal, fechaObjetivo: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Depósito manual */}
      <div className="mt-4 flex gap-2 items-end">
        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-gray-400" /> Monto
          </label>
          <input
            type="number"
            value={manualAmount}
            onChange={(e) => setManualAmount(Number(e.target.value))}
            className="p-2 border rounded-lg w-full"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            {manualType === "ingreso" ? (
              <FiPlus className="text-green-500" />
            ) : (
              <FiMinus className="text-red-500" />
            )} Tipo
          </label>
          <select
            value={manualType}
            onChange={(e) => setManualType(e.target.value as "ingreso" | "retiro")}
            className="p-2 border rounded-lg w-full"
          >
            <option value="ingreso">Ingreso</option>
            <option value="retiro">Retiro</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiEdit2 className="text-gray-400" /> Comentario (opcional)
          </label>
          <input
            type="text"
            value={manualComment}
            onChange={(e) => setManualComment(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>
        <button
          onClick={handleManualSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiSave /> Confirmar
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSave(goal)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-light tracking-tight"
        >
          <FiSave /> Guardar Cambios
        </button>
        <button
          onClick={() => onDelete(goal)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-light tracking-tight"
        >
          <FiTrash2 /> Eliminar Ahorro
        </button>
      </div>

      {/* Historial deduplicado y con keys seguras */}
      {goal.historial.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-light mb-2 flex items-center gap-2 tracking-tight">
            <FiEdit2 /> Historial de Movimientos
          </h3>
          {(() => {
            const historialUnico = Array.from(
              new Map(goal.historial.map((h) => [h.id, h])).values()
            );
            return (
              <ul className="list-disc pl-5">
                {historialUnico.map((h, idx) => (
                  <li key={`${h.id}-${idx}`}>
                    {new Date(h.fecha).toLocaleString()}: {h.cambio > 0 ? "+" : ""}
                    {formatCOP(h.cambio)} {h.comentario ? `(${h.comentario})` : ""}
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SavingsView;
