import React, { useEffect, useState } from 'react';
import {
  listenToUserTransactions,
  deleteTransaction,
  updateTransaction,
} from '../services/transactionService';
import type { Transaction } from '../types/transaction';
import { FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import { Timestamp } from 'firebase/firestore';

interface TransactionListProps {
  userId?: string;
}

interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  /** --- Cargar transacciones --- **/
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToUserTransactions(userId, (data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [userId]);

  /** --- Funciones de edición --- **/
  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id ?? null);
    setEditData({ ...transaction });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    if (editData.date && typeof editData.date === 'string') {
      editData.date = new Date(editData.date);
    }

    await updateTransaction(editingId, editData as Transaction);
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta transacción?')) {
      await deleteTransaction(id);
    }
  };

  /** --- Formato de fechas --- **/
  const formatDate = (date: Date | Timestamp): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
      });
    }
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  };

  /** --- Agrupar transacciones por mes --- **/
  const groupByMonth = () => {
    return transactions.reduce((acc, tx) => {
      const date = tx.date instanceof Timestamp ? tx.date.toDate() : tx.date;
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  };

  const groupedTransactions = groupByMonth();

  /** --- Calcular resumen mensual --- **/
  const calculateMonthlySummary = (txs: Transaction[]): MonthlySummary => {
    const income = txs
      .filter((tx) => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);
    const expense = txs
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => acc + tx.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      <h2 className="text-2xl font-light text-blue-600 text-center mb-6 tracking-tight">
        Historial de Transacciones
      </h2>

      {/* Vista por meses */}
      {!selectedMonth ? (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              No hay transacciones registradas
            </p>
          ) : (
            Object.entries(groupedTransactions).map(([month, txs]) => {
              const summary = calculateMonthlySummary(txs);
              const monthName = new Date(
                parseInt(month.split('-')[0]),
                parseInt(month.split('-')[1]) - 1
              ).toLocaleString('es-CO', { month: 'long', year: 'numeric' });

              return (
                <div
                  key={month}
                  className="p-4 rounded-lg border shadow-sm hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedMonth(month)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-light capitalize tracking-tight">
                      {monthName}
                    </h3>
                    <div className="text-right">
                      <p className="text-green-600 font-light tracking-tight">
                        Ingresos: {summary.income.toLocaleString('es-CO')}
                      </p>
                      <p className="text-red-600 font-light tracking-tight">
                        Gastos: {summary.expense.toLocaleString('es-CO')}
                      </p>
                      <p className="text-blue-600 font-light tracking-tight">
                        Balance: {summary.balance.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /** Vista detallada de un mes */
        <div>
          <button
            className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={() => setSelectedMonth(null)}
          >
            ← Volver
          </button>
          <h3 className="text-xl font-light mb-4 tracking-tight">
            Transacciones de{' '}
            {new Date(
              parseInt(selectedMonth.split('-')[0]),
              parseInt(selectedMonth.split('-')[1]) - 1
            ).toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
          </h3>

          {/* Resumen mensual dentro del detalle */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            {(() => {
              const summary = calculateMonthlySummary(
                groupedTransactions[selectedMonth]
              );
              return (
                <>
                  <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center shadow">
                    <h3 className="text-sm font-light tracking-tight">
                      Ingresos
                    </h3>
                    <p className="text-lg font-light tracking-tight">
                      ${summary.income.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center shadow">
                    <h3 className="text-sm font-light tracking-tight">
                      Gastos
                    </h3>
                    <p className="text-lg font-light tracking-tight">
                      ${summary.expense.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-center shadow">
                    <h3 className="text-sm font-light tracking-tight">
                      Balance
                    </h3>
                    <p className="text-lg font-light tracking-tight">
                      ${summary.balance.toLocaleString('es-CO')}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          <ul className="divide-y divide-gray-200">
            {groupedTransactions[selectedMonth]
              .sort((a, b) => {
                const dateA =
                  a.createdAt instanceof Timestamp
                    ? a.createdAt.toDate()
                    : new Date(a.createdAt);
                const dateB =
                  b.createdAt instanceof Timestamp
                    ? b.createdAt.toDate()
                    : new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime(); // Más reciente primero
              })
              .map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
                >
                  {editingId === transaction.id ? (
                    /** Modo edición */
                    <div className="flex-1 flex flex-col space-y-2">
                      <input
                        type="text"
                        value={editData.description || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Descripción"
                        className="border rounded-lg px-2 py-1 text-gray-800"
                      />
                      <input
                        type="number"
                        value={editData.amount || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            amount: Number(e.target.value),
                          })
                        }
                        placeholder="Monto"
                        className="border rounded-lg px-2 py-1 text-gray-800"
                      />
                      <select
                        value={editData.type || 'income'}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            type: e.target.value as 'income' | 'expense',
                          })
                        }
                        className="border rounded-lg px-2 py-1 text-gray-800"
                      >
                        <option value="income">Ingreso</option>
                        <option value="expense">Gasto</option>
                      </select>
                      <input
                        type="text"
                        value={editData.category || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, category: e.target.value })
                        }
                        placeholder="Categoría"
                        className="border rounded-lg px-2 py-1 text-gray-800"
                      />
                      <input
                        type="date"
                        value={
                          editData.date
                            ? new Date(editData.date)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            date: new Date(e.target.value),
                          })
                        }
                        className="border rounded-lg px-2 py-1 text-gray-800"
                      />
                    </div>
                  ) : (
                    /** Vista normal */
                    <>
                      <div className="flex flex-col">
                        <p className="font-light text-gray-800 tracking-tight">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500 font-light tracking-tight">
                          {transaction.category} •{' '}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-light tracking-tight ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{' '}
                        {transaction.amount.toLocaleString('es-CO')}
                      </p>
                    </>
                  )}

                  {/* Botones de accion */}
                  <div className="flex space-x-2 ml-4">
                    {editingId === transaction.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
                        >
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() =>
                            transaction.id && handleDelete(transaction.id)
                          }
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <FiTrash />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
