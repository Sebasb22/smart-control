// src/services/authListener.ts
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import type { User, Unsubscribe } from "firebase/auth";

export const listenToAuthChanges = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
