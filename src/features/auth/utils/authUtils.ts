import { db } from "@/lib/firebase/firebaseConfig";
import type { AuthError } from "firebase/auth";
import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  query,
  setDoc,
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
      return "Invalid or Expired Link. Please request a new link!";
    case "auth/expired-action-code":
      return "Your password reset link has expired. Please request a new one!";
    case "auth/popup-closed-by-user":
      return "You closed the log in window. Please try again!";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later!";
    case "firestore/permission-denied":
      return "Failed to create user profile!";
    case "auth/unknown-error":
      return "An unexpected error occurred. Please try again!";
    default:
      return "We encountered an error processing your request. Please try again!";
  }
};

export const isUserEmailAlreadyUsed = async (email: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

export const registerNewUser = async (
  displayName: string | null,
  email: string,
  userId: string
) => {
  const userProfile = {
    fullname: displayName || "Anonymous",
    username: email.split("@")[0],
    email,
    avatarUrl: "",
    preferences: {
      language: "English",
      appearance: "Light",
      notifications: true,
    },
  };

  await setDoc(doc(db, "users", userId), userProfile);
};

export const handleAuthErrors = (error: unknown): AuthErrorResponse => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const firebaseError = error as AuthError | FirestoreError;
    return { ...firebaseError };
  }

  return {
    code: "auth/unknown-error",
  };
};

export const getUserProfile = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  const userDocData = userDocSnap.data();

  return userDocData;
};
