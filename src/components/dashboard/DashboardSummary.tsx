import React, { useEffect, useState } from "react";
import { listenToUserTransactions } from "../../services/transactionService";
import type { Transaction } from "../../types/transaction";

interface DashboardSummaryProps {
  userId: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToUserTransactions(userId, (data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [userId]);

  /** 🗓 Filtrar solo transacciones del mes actual */
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthTransactions = transactions.filter(
    (t) => t.month === currentMonthKey
  );

  /** 💰 Calcular totales solo del mes actual */
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  /** Mostrar nombre del mes dinámicamente */
  const currentMonthName = now.toLocaleString("es-CO", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-lg mx-auto mt-6">
      {/* Título dinámico */}
      <h3 className="text-center text-lg font-light text-gray-700 mb-4 capitalize tracking-tight">
        Resumen de {currentMonthName}
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Ingresos */}
        <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center shadow">
          <h3 className="text-sm font-light tracking-tight">Ingresos</h3>
          <p className="text-lg font-light tracking-tight">
            ${totalIncome.toLocaleString("es-CO")}
          </p>
        </div>

        {/* Gastos */}
        <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center shadow">
          <h3 className="text-sm font-light tracking-tight">Gastos</h3>
          <p className="text-lg font-light tracking-tight">
            ${totalExpense.toLocaleString("es-CO")}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-center shadow">
          <h3 className="text-sm font-light tracking-tight">Balance</h3>
          <p
            className={`text-lg font-light tracking-tight ${
              balance >= 0 ? "text-blue-800" : "text-red-800"
            }`}
          >
            ${balance.toLocaleString("es-CO")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
