import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const CATEGORY_COLLECTION = "categories";

// 🔹 Agregar nueva categoría
export const addCustomCategory = async (userId: string, name: string) => {
  if (!userId || !name.trim()) throw new Error("Usuario y nombre requeridos");

  await addDoc(collection(db, CATEGORY_COLLECTION), {
    userId,
    name: name.trim(),
    createdAt: Timestamp.now(),
  });
};

// 🔹 Obtener categorías personalizadas de un usuario
export const getCustomCategories = async (userId: string) => {
  const q = query(
    collection(db, CATEGORY_COLLECTION),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
