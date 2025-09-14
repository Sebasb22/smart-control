import { useState } from "react";
import { addTransaction } from "../services/transactionService";
import type { User } from "firebase/auth";
import {
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiMinus,
  FiSave,
  FiTag,
} from "react-icons/fi";

interface Props {
  user: User;
}

export default function TransactionForm({ user }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("General");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) {
      alert("Por favor completa todos los campos");
      return;
    }

    const now = new Date();
    const day = now.getDate();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    await addTransaction({
      type,
      amount: Number(amount),
      description,
      userId: user.uid,
      category,
      day,
      month,
      date: now,
      createdAt: now,
    });

    alert("Transacción guardada");
    setAmount("");
    setDescription("");
    setCategory("General");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow border border-gray-200"
    >
      <h3 className="text-xl font-light mb-6 text-gray-700 text-center flex items-center gap-2 tracking-tight">
        <FiEdit2 className="inline-block text-blue-500" /> Registrar transacción
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-1 tracking-tight">
          {type === "income" ? (
            <FiPlus className="text-green-500" />
          ) : (
            <FiMinus className="text-red-500" />
          )}{" "}
          Tipo
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-1 tracking-tight">
          <FiTag className="text-purple-400" /> Categoría
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:border-purple-500 bg-transparent outline-none transition"
        >
          <option value="General">General</option>
          <option value="Comida">Comida</option>
          <option value="Transporte">Transporte</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Salud">Salud</option>
          <option value="Educación">Educación</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-1 tracking-tight">
          <FiDollarSign className="text-green-400" /> Monto en COP
        </label>
        <input
          type="number"
          placeholder="Monto en COP"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:border-green-500 bg-transparent outline-none transition text-green-700 font-semibold"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-1 tracking-tight">
          <FiEdit2 className="text-gray-400" /> Descripción
        </label>
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg font-light shadow hover:bg-green-700 transition flex items-center gap-2 w-full justify-center tracking-tight"
      >
        <FiSave /> Guardar
      </button>
    </form>
  );
}
