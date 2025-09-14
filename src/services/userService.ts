import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  deleteDoc,
  doc,
} from "firebase/firestore";

/**
 * Elimina toda la información relacionada a un usuario en Firestore
 */
export const deleteUserAndData = async (userId: string) => {
  try {
    console.log(`Iniciando eliminación para usuario: ${userId}`);

    const batch = writeBatch(db);

    // --- Eliminar ahorros ---
    const savingsQuery = query(
      collection(db, "savings"),
      where("userId", "==", userId)
    );
    const savingsSnapshot = await getDocs(savingsQuery);
    savingsSnapshot.forEach((docSnap) =>
      batch.delete(doc(db, "savings", docSnap.id))
    );

    // --- Eliminar deudas ---
    const debtsQuery = query(
      collection(db, "debts"),
      where("userId", "==", userId)
    );
    const debtsSnapshot = await getDocs(debtsQuery);
    debtsSnapshot.forEach((docSnap) =>
      batch.delete(doc(db, "debts", docSnap.id))
    );

    // --- Otras colecciones relacionadas (si existen) ---
    const collectionsToClean = ["transactions", "goals"];
    for (const col of collectionsToClean) {
      const q = query(collection(db, col), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => batch.delete(doc(db, col, docSnap.id)));
    }

    // --- Eliminar documento principal del usuario ---
    batch.delete(doc(db, "users", userId));

    await batch.commit();

    console.log("✅ Usuario y datos eliminados correctamente.");
    return { success: true, message: "Usuario y todos sus datos eliminados." };
  } catch (error) {
    console.error("❌ Error eliminando usuario y datos:", error);
    return {
      success: false,
      message: "Error eliminando usuario y datos",
      error,
    };
  }
};

/**
 * Borra todos los datos relacionados a un usuario.
 */
export const deleteUserData = async (userId: string) => {
  const collections = ["savings", "debts"]; // aquí agregas más colecciones si es necesario

  for (const col of collections) {
    const q = query(collection(db, col), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const deletions = snapshot.docs.map((d) => deleteDoc(doc(db, col, d.id)));
    await Promise.all(deletions);
  }

  console.log(`Datos de usuario ${userId} eliminados ✅`);
};
