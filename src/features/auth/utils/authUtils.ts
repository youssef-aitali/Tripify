import { db } from "@/lib/firebase/firebaseConfig";
import type { AuthError } from "firebase/auth";
import {
  addDoc,
  collection,
  FirestoreError,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { AuthErrorResponse } from "../authTypes";

export const getFirebaseErrorMessage = (code: string) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered!";
    case "auth/weak-password":
      return "Password should be at least 6 characters!";
    case "auth/invalid-email":
      return "Please enter a valid email!";
    case "firestore/permission-denied":
      return "Failed to create user profile!";
    case "auth/requires-recent-login":
      return "Please sign in again before changing your password!";
    default:
      return "Authentication failed. Please try again!";
  }
};

// Check if user document already exists
export const isUserEmailAlreadyUsed = async (email: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

export const registerNewUser = async (
  username: string | null,
  email: string
) => {
  const userProfile = {
    username: !username ? "Anonymous" : username,
    email,
    avatarUrl: "",
    preferences: {
      language: "English",
      appearance: "Light",
      notifications: true,
    },
  };

  await addDoc(collection(db, "users"), userProfile);
};

export const handleAuthErrors = (error: unknown): AuthErrorResponse => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const firebaseError = error as AuthError | FirestoreError;
    return { error: firebaseError };
  }

  // Fallback for unknown errors
  return {
    error: {
      code: "auth/unknown-error",
      message: "An unknown error occurred",
    },
  };
};
