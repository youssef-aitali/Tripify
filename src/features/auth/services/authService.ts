// features/auth/services/firebaseAuth.ts
import { auth, db } from "@/lib/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export const registerWithEmailAndPassword = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);

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

    const docRef = await addDoc(collection(db, "users"), userProfile);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    // Type guard to ensure it's an AuthError
    if (typeof error === "object" && error !== null && "code" in error) {
      const authError = error as AuthError;

      console.error(
        `Authentication Error (${authError.code}): ${authError.message}`
      );
    }

    // Handle non-AuthError cases
    console.error("Unexpected error during Sign up:", error);
  }
};
/* 
const getFriendlyErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Please enter a valid email';
    case 'firestore/permission-denied':
      return 'Failed to create user profile';
    default:
      return 'Registration failed. Please try again';
  }
}; */

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
