// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNHZLpLuoEk1cKdUyJBsC8WPDP-MCkENU",
  authDomain: "gastos-personales-998cf.firebaseapp.com",
  projectId: "gastos-personales-998cf",
  storageBucket: "gastos-personales-998cf.appspot.com", // ✅ CORRECTO
  messagingSenderId: "709479231028",
  appId: "1:709479231028:web:b61fc32e3cd010a1ab6461",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const usersCollection = collection(db, "users");

export const fetchUsers = async () => {
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  return userList;
};
