import { useState } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";
import { FaMoneyBillWave, FaPercent, FaCalendarDay } from "react-icons/fa";

export default function InvestmentProjection() {
  const [initialAmount, setInitialAmount] = useState<string>("");
  const [profitability, setProfitability] = useState<string>("");
  const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("daily");
  const [days, setDays] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number | null>(null);

  const formatAmount = (value: string) => {
    // Reemplaza comas y elimina caracteres no numéricos
    return value.replace(/[^0-9,]/g, "").replace(",", ".");
  };

  const calculateProjection = () => {
    const amount = parseFloat(formatAmount(initialAmount));
    const rate = parseFloat(formatAmount(profitability));

    if (isNaN(amount) || isNaN(rate)) {
      alert(
        "Por favor ingresa valores válidos para el monto y la rentabilidad."
      );
      return;
    }

    let totalDays: number;

    if (period === "daily") {
      totalDays = parseInt(days);
      if (isNaN(totalDays) || totalDays <= 0) {
        alert("Por favor ingresa un número válido de días.");
        return;
      }
    } else if (period === "monthly") {
      totalDays = 30;
    } else {
      totalDays = 365;
    }

    let dailyRate = rate;
    if (period === "monthly") dailyRate = rate / 30;
    if (period === "yearly") dailyRate = rate / 365;

    const result = amount * Math.pow(1 + dailyRate / 100, totalDays);
    setFinalAmount(result);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-lg max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-light mb-6 flex items-center gap-2 tracking-tight text-gray-700">
        <FiTrendingUp className="text-green-500" /> Proyección de Inversión
      </h2>

      {/* Monto Inicial */}
      <div className="mb-4">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-2 tracking-tight">
          <FaMoneyBillWave className="text-blue-500" /> Monto Inicial
        </label>
        <input
          type="text"
          placeholder="Ingresa el monto inicial"
          value={initialAmount}
          onChange={(e) => setInitialAmount(formatAmount(e.target.value))}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-right"
          required
        />
      </div>

      {/* Rentabilidad */}
      <div className="mb-4">
        <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-2 tracking-tight">
          <FaPercent className="text-purple-500" /> Rentabilidad
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ingresa el porcentaje"
            value={profitability}
            onChange={(e) => {
              // Permite solo números y punto decimal, sin formatear en tiempo real
              const val = e.target.value.replace(/[^0-9.]/g, "");
              setProfitability(val);
            }}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm text-right"
          />
          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as "daily" | "monthly" | "yearly")
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="daily">Diaria</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
          </select>
        </div>
        <p className="text-sm font-light text-gray-500 mt-1 tracking-tight">
          Ingresa el porcentaje, ejemplo: 0.5 = 0.5%
        </p>
      </div>

      {/* Días - solo visible si el período es "daily" */}
      {period === "daily" && (
        <div className="mb-4">
          <label className="block text-sm font-light text-gray-500 mb-1 flex items-center gap-2 tracking-tight">
            <FaCalendarDay className="text-yellow-500" /> Número de días
          </label>
          <input
            type="text"
            placeholder="Ej: 40"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition shadow-sm text-right"
          />
        </div>
      )}

      {/* Botón de calcular */}
      <button
        onClick={calculateProjection}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-light tracking-tight"
      >
        Calcular
      </button>

      {/* Resultado */}
      {finalAmount !== null && (
        <motion.div
          className="mt-6 p-4 border rounded-lg bg-green-50 text-green-700 font-light tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>
            Monto final proyectado:{" "}
            <span className="text-green-800">
              $
              {finalAmount.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
          <p className="text-sm font-light text-gray-500 mt-1 tracking-tight">
            Crecimiento total:{" "}
            {(
              ((finalAmount - parseFloat(formatAmount(initialAmount))) /
                parseFloat(formatAmount(initialAmount))) *
              100
            ).toFixed(2)}
            %
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
