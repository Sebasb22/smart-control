// src/services/authService.ts
import { auth, googleProvider, db } from "../firebase/config";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// ==========================
// Guardar usuario en Firestore (reutilizable)
// ==========================
const saveUserToFirestore = async (user: User, name?: string) => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      nombre: name || user.displayName || "Usuario sin nombre",
      email: user.email,
      foto: user.photoURL || null,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    });
    console.log("✅ Nuevo usuario registrado en Firestore");
  } else {
    console.log("ℹ️ Usuario ya existe en Firestore");
  }
};

// ==========================
// Login con Google
// ==========================
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await saveUserToFirestore(user); // Guardar si no existe

    return { ...user, displayName: user.displayName }; // Retornar con displayName
  } catch (error: any) {
    console.error(
      "❌ Error al iniciar sesión con Google:",
      error.code,
      error.message
    );
    throw new Error("Error al iniciar sesión con Google. Intenta nuevamente.");
  }
};

// ==========================
// Registro con Email y Contraseña
// ==========================
export const registerWithEmail = async (
  email: string,
  password: string,
  name?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await saveUserToFirestore(user, name); // Guardar en Firestore

    return { ...user, displayName: name }; // Retornar con displayName
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("El correo ya está registrado.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    throw new Error("Error al registrar usuario. Intenta nuevamente.");
  }
};

// ==========================
// Login con Email y Contraseña
// ==========================
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Traer nombre de Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const nombre = userDoc.exists() ? userDoc.data().nombre : undefined;

    console.log("✅ Sesión iniciada con correo y contraseña");
    return { ...user, displayName: nombre };
  } catch (error: any) {
    console.error("❌ Error al iniciar sesión:", error.code, error.message);

    if (error.code === "auth/user-not-found") {
      throw new Error("No existe una cuenta con este correo.");
    }
    if (error.code === "auth/wrong-password") {
      throw new Error("Contraseña incorrecta.");
    }

    throw new Error("Error al iniciar sesión. Intenta nuevamente.");
  }
};

// ==========================
// Cerrar sesión
// ==========================
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("👋 Sesión cerrada correctamente");
  } catch (error: any) {
    console.error("❌ Error al cerrar sesión:", error.message);
    throw new Error("No se pudo cerrar la sesión. Intenta nuevamente.");
  }
};
