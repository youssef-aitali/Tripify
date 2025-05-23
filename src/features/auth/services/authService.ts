import { auth, db, googleProvider } from "@/lib/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";
import {
  collection,
  addDoc,
  type FirestoreError,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface CustomError extends Error {
  code: string;
}

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

export const signUpWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const user = userCredential.user;

    // Check if user document already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const error = new Error(
        "User with this email already exists"
      ) as CustomError;
      error.code = "custom/email-already-exists"; // Add a code
      throw error;
    }

    const userProfile = {
      username: user.displayName,
      email: user.email,
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
      const firebaseError = error as AuthError | FirestoreError | CustomError;
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
