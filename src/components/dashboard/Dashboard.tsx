import React, { useEffect, useState } from "react";
import BalanceCard from "./BalanceCard";
import ExpenseChart from "./ExpenseChart";
import RecentTransactions from "./RecentTransactions";
import { listenToUserTransactions } from "../../services/transactionService";
import { CATEGORIES } from "../../data/categories";
import type { Transaction } from "../../types/transaction";

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!userId) return;

    // 🔹 Escuchar en tiempo real las transacciones
    const unsubscribe = listenToUserTransactions(userId, (data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [userId]);

  // 🗓 Obtener mes actual en formato YYYY-MM
  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  // 🔹 Filtrar solo transacciones del mes actual
  const currentMonthTransactions = transactions.filter(
    (t) => t.month === currentMonth
  );

  // 💰 Totales solo para el mes actual
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 📊 Datos para la gráfica solo del mes actual
  const chartData = CATEGORIES.map((cat) => ({
    category: cat.label,
    amount: currentMonthTransactions
      .filter((t) => t.category === cat.id && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0),
  })).filter((item) => item.amount > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Balance mensual */}
      <BalanceCard
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfica de gastos */}
        <ExpenseChart data={chartData} />

        {/* Transacciones recientes (todas, sin filtro por mes) */}
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
