import { db } from "../firebase/config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Saving } from "../types/savings";

export const addSaving = async (
  saving: Omit<Saving, "id" | "creadoEn" | "actualizadoEn">
) => {
  // Si el ahorro tiene historial, agrega un id único a cada entrada
  const historialConId = Array.isArray(saving.historial)
    ? saving.historial.map(
        (h: {
          fecha: string;
          cambio: number;
          comentario: string;
          id?: string;
        }) => ({
          ...h,
          id:
            h.id ||
            (typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`),
        })
      )
    : [];

  const docRef = await addDoc(collection(db, "savings"), {
    ...saving,
    ...(historialConId.length > 0 ? { historial: historialConId } : {}),
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  return docRef.id;
};

export const updateSaving = async (id: string, data: Partial<Saving>) => {
  const docRef = doc(db, "savings", id);
  // Si el ahorro tiene historial, agrega un id único a cada entrada que no lo tenga
  const historialArr = (data as any).historial;
  const historialConId = Array.isArray(historialArr)
    ? historialArr.map(
        (h: {
          fecha: string;
          cambio: number;
          comentario: string;
          id?: string;
        }) =>
          h.id
            ? h
            : {
                ...h,
                id:
                  typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`,
              }
      )
    : undefined;
  await updateDoc(docRef, {
    ...data,
    ...(historialConId ? { historial: historialConId } : {}),
    actualizadoEn: serverTimestamp(),
  });
};

export const deleteSaving = async (id: string) => {
  await deleteDoc(doc(db, "savings", id));
};

export const listenToUserSavings = (
  userId: string,
  callback: (savings: any[]) => void
) => {
  const q = query(
    collection(db, "savings"),
    where("userId", "==", userId),
    orderBy("creadoEn", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const savingsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(savingsData);
  });
};
