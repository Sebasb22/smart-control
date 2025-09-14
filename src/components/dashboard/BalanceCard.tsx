import React from "react";

interface BalanceCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  totalIncome,
  totalExpense,
  balance,
}) => {
  // 🗓 Obtener el nombre del mes actual
  const currentMonthName = new Date().toLocaleString("es-CO", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Título con el mes actual */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
        Resumen financiero - {currentMonthName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ingresos */}
        <div className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-green-700 font-semibold">Ingresos</p>
          <h2 className="text-2xl font-bold text-green-800">
            ${totalIncome.toLocaleString("es-CO")}
          </h2>
        </div>

        {/* Gastos */}
        <div className="bg-red-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-red-700 font-semibold">Gastos</p>
          <h2 className="text-2xl font-bold text-red-800">
            ${totalExpense.toLocaleString("es-CO")}
          </h2>
        </div>

        {/* Balance */}
        <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-blue-700 font-semibold">Balance</p>
          <h2
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-800" : "text-red-800"
            }`}
          >
            ${balance.toLocaleString("es-CO")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
