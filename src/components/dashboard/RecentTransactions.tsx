import React from "react";
import type { Transaction } from "../../types/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-xl font-bold mb-4">Transacciones Recientes</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No hay transacciones registradas.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.slice(0, 5).map((t) => (
            <li key={t.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-gray-500">{t.category}</p>
              </div>
              <span
                className={`font-bold ${
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {t.type === "income" ? "+" : "-"}$
                {t.amount.toLocaleString("es-CO")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;
