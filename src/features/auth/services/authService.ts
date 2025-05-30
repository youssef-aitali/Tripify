import { auth, googleProvider } from "@/lib/firebase/firebaseConfig";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  handleAuthErrors,
  isUserEmailAlreadyUsed,
  registerNewUser,
} from "../utils/authUtils";

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

    const isEmailUsed = await isUserEmailAlreadyUsed(user.email!);

    if (isEmailUsed) {
      throw {
        code: "auth/email-already-in-use",
      };
    }

    await registerNewUser(username, email);

    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    console.log(user);
    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const signUpWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const user = userCredential.user;

    const isEmailUsed = await isUserEmailAlreadyUsed(user.email!);
    if (isEmailUsed) {
      throw {
        code: "auth/email-already-in-use",
      };
    }

    await registerNewUser(user.displayName, user.email!);

    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const user = userCredential.user;

    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
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
