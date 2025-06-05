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
    case "auth/requires-recent-login":
      return "Please sign in again before changing your password!";
    case "auth/invalid-action-code":
      return "Your password reset link is invalid or has already been used. Please request a new reset link!";
    case "auth/expired-action-code":
      return "Your password reset link has expired. Please request a new one!";
    case "firestore/permission-denied":
      return "Failed to create user profile!";
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
    return { ...firebaseError };
  }

  // Fallback for unknown errors
  return {
    code: "auth/unknown-error",
    message: "An unknown error occurred!",
  };
};
