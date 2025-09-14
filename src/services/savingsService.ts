import { db } from "../firebase/config";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import type { Saving } from "../types/savings";

/**
 * Agrega un nuevo ahorro a la base de datos
 */
export const addSaving = async (
  saving: Omit<Saving, "id" | "creadoEn" | "actualizadoEn">
) => {
  // Asegura que cada entrada del historial tenga un ID único
  const historialConId = Array.isArray(saving.historial)
    ? saving.historial.map((h) => ({
        ...h,
        id:
          h.id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`),
      }))
    : [];

  // Evita guardar el campo id en Firestore
  const { id, ...savingWithoutId } = saving as any;

  const docRef = await addDoc(collection(db, "savings"), {
    ...savingWithoutId,
    ...(historialConId.length > 0 ? { historial: historialConId } : {}),
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Actualiza un ahorro existente
 */
export const updateSaving = async (id: string, data: Partial<Saving>) => {
  const docRef = doc(db, "savings", id);

  // Valida el historial antes de actualizar
  const historialArr = (data as any).historial;
  const historialConId = Array.isArray(historialArr)
    ? historialArr.map((h) => ({
        ...h,
        id:
          h.id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`),
      }))
    : undefined;

  await updateDoc(docRef, {
    ...data,
    ...(historialConId ? { historial: historialConId } : {}),
    actualizadoEn: serverTimestamp(),
  });
};

/**
 * Elimina un ahorro por su ID
 */
export const deleteSaving = async (id: string) => {
  await deleteDoc(doc(db, "savings", id));
};

/**
 * Escucha en tiempo real los ahorros del usuario
 */
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

/**
 * Migración: Limpia los historiales duplicados y les asigna IDs únicos
 */
export const migrateUserSavings = async (userId: string) => {
  const q = query(collection(db, "savings"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (Array.isArray(data.historial)) {
      const seen = new Set();
      const historialLimpio = data.historial.map((h: any) => {
        let id = h.id;

        // Genera un nuevo ID si está duplicado o no existe
        if (!id || seen.has(id)) {
          id =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`;
        }

        seen.add(id);
        return { ...h, id };
      });

      // Actualiza Firestore con el historial limpio
      await updateSaving(docSnap.id, { historial: historialLimpio });
    }
  }
};
