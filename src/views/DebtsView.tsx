// src/views/DebtsView.tsx
import React, { useEffect, useState } from "react";
import {
  listenToUserDebts,
  addDebt,
  updateDebt,
  deleteDebt,
} from "../services/debtsService";
import type { Debt } from "../types/Debt";
import type { User } from "firebase/auth";
import {
  FiTarget,
  FiEdit2,
  FiDollarSign,
  FiCalendar,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const formatCOP = (value: number) =>
  value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

interface Props {
  currentUser: User;
}

const DebtsView: React.FC<Props> = ({ currentUser }) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = listenToUserDebts(currentUser.uid, setDebts);
    return unsubscribe;
  }, [currentUser]);

  const handleAddDebt = async () => {
    const today = new Date().toISOString().split("T")[0];
    const newDebt: Debt = {
      nombre: "Nueva deuda",
      descripcion: "",
      montoTotal: 0,
      montoPagado: 0,
      fechaInicio: today,
      fechaLimite: today,
      historial: [],
    };
    const id = await addDebt({ ...newDebt, userId: currentUser.uid });
    setSelectedDebt({ ...newDebt, id });
  };

  const handleSave = async (data: Debt) => {
    if (!data.id) return;
    await updateDebt(data.id, data);
  };

  const handleDelete = async (debt: Debt) => {
    if (!debt.id) return;
    await deleteDebt(debt.id);
    setSelectedDebt(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mis Deudas</h2>

      <button
        onClick={handleAddDebt}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        + Agregar Deuda
      </button>

      {/* Lista de deudas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {debts.map((debt) => (
          <div
            key={debt.id}
            onClick={() => setSelectedDebt(debt)}
            className="p-4 border rounded-lg cursor-pointer hover:shadow-lg"
          >
            <h3 className="font-semibold">{debt.nombre}</h3>
            <p>Pagado: {formatCOP(debt.montoPagado)}</p>
            <p>Total: {formatCOP(debt.montoTotal)}</p>
            <p>
              Estado:{" "}
              {debt.montoPagado >= debt.montoTotal ? "Pagada" : "Pendiente"}
            </p>
          </div>
        ))}
      </div>

      {selectedDebt && (
        <DebtDetailView
          debtData={selectedDebt}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelectedDebt(null)}
        />
      )}
    </div>
  );
};

type DetailProps = {
  debtData: Debt;
  onSave: (data: Debt) => void;
  onDelete: (data: Debt) => void;
  onClose?: () => void;
};

const DebtDetailView: React.FC<DetailProps> = ({
  debtData,
  onSave,
  onDelete,
  onClose,
}) => {
  const [debt, setDebt] = useState<Debt>(debtData);
  const [payment, setPayment] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    setDebt(debtData);
  }, [debtData]);

  const handlePayment = () => {
    if (payment <= 0) return;
    const newPaid = debt.montoPagado + payment;
    const updatedDebt: Debt = {
      ...debt,
      montoPagado: newPaid,
      historial: [
        {
          fecha: new Date().toISOString(),
          cambio: payment,
          comentario: comment,
        },
        ...debt.historial,
      ],
    };
    setDebt(updatedDebt);
    onSave(updatedDebt);
    setPayment(0);
    setComment("");
  };

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-light text-gray-700 flex items-center gap-2 tracking-tight">
          <FiTarget className="inline-block text-red-500" /> Detalle de la Deuda
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
            <FiEdit2 className="text-gray-400" /> Nombre de la deuda
          </label>
          <input
            type="text"
            value={debt.nombre}
            onChange={(e) => setDebt({ ...debt, nombre: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-red-500 bg-transparent outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiEdit2 className="text-gray-400" /> Descripción
          </label>
          <textarea
            value={debt.descripcion}
            onChange={(e) => setDebt({ ...debt, descripcion: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-red-500 bg-transparent outline-none transition"
            rows={2}
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-red-400" /> Monto total
          </label>
          <input
            type="number"
            value={debt.montoTotal}
            onChange={(e) =>
              setDebt({ ...debt, montoTotal: Number(e.target.value) })
            }
            className="w-full p-2 border-b border-gray-300 focus:border-red-500 bg-transparent outline-none transition text-red-700 font-semibold"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-green-400" /> Monto pagado
          </label>
          <input
            type="number"
            value={debt.montoPagado}
            readOnly
            className="w-full p-2 border-b border-gray-300 bg-gray-100 outline-none transition text-green-700 font-semibold"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiCalendar className="text-blue-400" /> Fecha límite
          </label>
          <input
            type="date"
            value={debt.fechaLimite}
            onChange={(e) => setDebt({ ...debt, fechaLimite: e.target.value })}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Pago manual */}
      <div className="mt-4 flex gap-2 items-end">
        <div>
          <label className="flex items-center gap-1 font-light text-gray-500 mb-1 tracking-tight">
            <FiDollarSign className="text-gray-400" /> Monto a pagar
          </label>
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(Number(e.target.value))}
            className="p-2 border rounded-lg w-full"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 font-semibold text-gray-600 mb-1">
            <FiEdit2 className="text-gray-400" /> Comentario (opcional)
          </label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>
        <button
          onClick={handlePayment}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiSave /> Pagar
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSave(debt)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-light tracking-tight"
        >
          <FiSave /> Guardar Cambios
        </button>
        <button
          onClick={() => onDelete(debt)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-light tracking-tight"
        >
          <FiTrash2 /> Eliminar Deuda
        </button>
      </div>

      {/* Historial */}
      {debt.historial.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-light mb-2 flex items-center gap-2 tracking-tight">
            <FiEdit2 /> Historial de Pagos
          </h3>
          <ul className="list-disc pl-5">
            {debt.historial.map((h, idx) => (
              <li key={idx}>
                {new Date(h.fecha).toLocaleString()} - {formatCOP(h.cambio)}{" "}
                {h.comentario ? `(${h.comentario})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebtsView;
