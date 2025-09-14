// src/services/debtsService.ts
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { Debt } from "../types/Debt";

const DEBTS_COLLECTION = "debts";

// Escuchar cambios en tiempo real
export const listenToUserDebts = (
  userId: string,
  callback: (debts: Debt[]) => void
) => {
  const q = query(
    collection(db, DEBTS_COLLECTION),
    where("userId", "==", userId)
  );
  return onSnapshot(q, (snapshot) => {
    const debts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Debt[];
    callback(debts);
  });
};

// Agregar deuda
export const addDebt = async (debt: Debt & { userId: string }) => {
  const docRef = await addDoc(collection(db, DEBTS_COLLECTION), debt);
  return docRef.id;
};

// Actualizar deuda
export const updateDebt = async (id: string, updatedDebt: Partial<Debt>) => {
  const debtRef = doc(db, DEBTS_COLLECTION, id);
  await updateDoc(debtRef, updatedDebt);
};

// Eliminar deuda
export const deleteDebt = async (id: string) => {
  const debtRef = doc(db, DEBTS_COLLECTION, id);
  await deleteDoc(debtRef);
};
