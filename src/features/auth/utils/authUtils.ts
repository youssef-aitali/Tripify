import { auth, db } from "@/lib/firebaseConfig";
import {
  fetchSignInMethodsForEmail,
  type AuthError,
  type User,
} from "firebase/auth";
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
import type { AuthErrorResponse } from "@/features/authTypes";

export const getFirebaseErrorMessage = (code: string) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email. Did you mean to sign in?";
    case "auth/existing-unverified-email":
      return `Verify the existing email to add Google Sign-In!`;
    case "auth/email-used-with-google":
      return `This email is already signed up with Google. Please sign in, or use a different email!`;
    case "auth/weak-password":
      return "Password should be at least 6 characters!";
    case "auth/invalid-email":
      return "Please enter a valid email!";
    case "auth/invalid-credential":
      return "Invalid login details. Check your credentials and try again!";
    case "auth/requires-recent-login":
      return "Please sign in again before changing your password!";
    case "auth/invalid-action-code":
      return "Invalid or Expired Link. Please request a new link!";
    case "auth/expired-action-code":
      return "Your password reset link has expired. Please request a new one!";
    case "auth/popup-closed-by-user":
      return "You closed the Google authentication window. Please try again!";
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

export const isUserDocAlreadyExists = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists();
};

export const createUserData = (user: User) => {
  return {
    fullname: user.displayName || "",
    username: user.email?.split("@")[0],
    email: user.email,
    photoURL: user.photoURL,
    preferences: {
      //language: "en",
      appearance: "Light",
      notifications: true,
    },
    createdAt: new Date(),
  };
};

export const registerNewUser = async (user: User) => {
  await setDoc(doc(db, "users", user.uid), createUserData(user), {
    merge: true,
  });
};

export const handleAuthErrors = ({
  error,
  existingEmailMethod,
}: {
  error: unknown;
  existingEmailMethod?: string;
}): AuthErrorResponse => {
  if (
    error instanceof Error &&
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  ) {
    const firebaseError = error as AuthError | FirestoreError;
    //const message = error.message as string;
    //console.log(message.includes("auth/existing-unverified-email"));
    return error.message.includes("auth/existing-unverified-email")
      ? { ...firebaseError, code: "auth/existing-unverified-email" }
      : existingEmailMethod === "google.com"
      ? { ...firebaseError, code: "auth/email-used-with-google" }
      : { ...firebaseError };
  }

  /*  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    error.message === "auth/existing-unverified-email"
  ) {
    console.log("here");

    return {
      code: error.message,
    };

    // handle other known custom errors here similarly if needed
  } */

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
