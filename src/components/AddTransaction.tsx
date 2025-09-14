import React, { useState } from "react";
import { addTransaction } from "../services/transactionService";
import { CATEGORIES } from "../data/categories";
import { Timestamp } from "firebase/firestore";

// React Icons
import {
  FaMoneyBillWave,
  FaTag,
  FaFileAlt,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";

interface AddTransactionProps {
  userId: string;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ userId }) => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState<string>("");

  // 🔹 Da formato con puntos de miles
  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("Debes iniciar sesión");

    if (!amount || !description || !category) {
      return alert("Por favor completa todos los campos.");
    }

    try {
      const now = new Date();

      await addTransaction({
        userId,
        amount: Number(amount.replace(/\./g, "")), // Sin puntos
        description,
        type,
        category,
        date: Timestamp.now().toDate(), // Fecha completa
        day: now.getDate(), // Día del mes (1-31)
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}`, // YYYY-MM
        createdAt: Timestamp.now().toDate(),
      });

      alert("Transacción agregada con éxito 🎉");

      // Reset de formulario
      setAmount("");
      setDescription("");
      setType("income");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Error al guardar transacción");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-blue-600 text-center flex items-center justify-center gap-2">
        <FaMoneyBillWave className="text-blue-500" />
        Agregar Transacción
      </h2>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          <FaMoneyBillWave className="text-blue-500" />
          Monto
        </label>
        <input
          type="text"
          placeholder="Ingresa el monto"
          value={amount}
          onChange={(e) => setAmount(formatAmount(e.target.value))}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-right"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          <FaFileAlt className="text-blue-500" />
          Descripción
        </label>
        <input
          type="text"
          placeholder="Ej. Pago de arriendo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          required
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          {type === "income" ? (
            <FaArrowCircleUp className="text-green-500" />
          ) : (
            <FaArrowCircleDown className="text-red-500" />
          )}
          Tipo
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          <FaTag className="text-blue-500" />
          Categoría
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          required
        >
          <option value="">Selecciona una categoría</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
      >
        <FaMoneyBillWave />
        Guardar Transacción
      </button>
    </form>
  );
};

export default AddTransaction;
