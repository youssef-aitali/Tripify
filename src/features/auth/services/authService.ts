import { auth, db } from "@/lib/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { collection, addDoc, type FirestoreError } from "firebase/firestore";

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const userProfile = {
      username,
      email,
      avatarUrl: "",
      preferences: {
        language: "English",
        appearance: "Light",
        notifications: true,
      },
    };

    await addDoc(collection(db, "users"), userProfile);

    return { user };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const firebaseError = error as AuthError | FirestoreError;

      return { firebaseError };
    }

    // Fallback for unknown errors
    return {
      unknownError: {
        code: "auth/unknown-error",
        message: "An unknown error occurred",
      },
    };
  }
};

export const getFriendlyErrorMessage = (code: string) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered!";
    case "auth/weak-password":
      return "Password should be at least 6 characters!";
    case "auth/invalid-email":
      return "Please enter a valid email!";
    case "firestore/permission-denied":
      return "Failed to create user profile!";
    default:
      return "Registration failed. Please try again!";
  }
};

/*  export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  // ... implementation
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}} */
