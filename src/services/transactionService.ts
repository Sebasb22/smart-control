import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  Timestamp,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import type { Transaction } from "../types/transaction";

const transactionsCollection = collection(db, "transactions");

// 🔹 Agregar transacción
export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  const docRef = await addDoc(transactionsCollection, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date), // Fecha completa
    createdAt: Timestamp.fromDate(transaction.createdAt), // Fecha de creación
    day: transaction.day, // Guardar el día como número o string
  });
  return docRef.id;
};

// 🔹 Escuchar transacciones en tiempo real
export const listenToUserTransactions = (
  userId: string,
  callback: (transactions: Transaction[]) => void
) => {
  const q = query(transactionsCollection, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: (data.date as Timestamp).toDate(),
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Transaction;
    });

    callback(transactions);
  });
};

// 🔹 Actualizar una transacción específica
export const updateTransaction = async (
  id: string,
  updatedData: Partial<Omit<Transaction, "id">>
) => {
  const docRef = doc(db, "transactions", id);

  // Convertir fechas a Timestamp solo si son Date
  const dataToUpdate: any = { ...updatedData };

  if (updatedData.date instanceof Date) {
    dataToUpdate.date = Timestamp.fromDate(updatedData.date);
  }

  if (updatedData.createdAt instanceof Date) {
    dataToUpdate.createdAt = Timestamp.fromDate(updatedData.createdAt);
  }

  if (updatedData.day !== undefined) {
    dataToUpdate.day = updatedData.day;
  }

  await updateDoc(docRef, dataToUpdate);
};

// 🔹 Eliminar una transacción específica
export const deleteTransaction = async (id: string) => {
  const docRef = doc(db, "transactions", id);
  await deleteDoc(docRef);
};

// 🔹 Eliminar todas las transacciones de un usuario
export const deleteAllUserTransactions = async (userId: string) => {
  const q = query(transactionsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const batchPromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(batchPromises);
};
