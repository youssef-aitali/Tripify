import { auth, googleProvider } from "@/lib/firebase/firebaseConfig";

import {
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
  type User,
} from "firebase/auth";

import {
  getFirebaseErrorMessage,
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
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
  }
};

export const checkResetLinkValidity = async (actionCode: string) => {
  try {
    const email = await verifyPasswordResetCode(auth, actionCode);
    return email;
  } catch (error) {
    console.log(false);
  }
};

export const setNewPassword = async (
  actionCode: string,
  newPassword: string
) => {
  try {
    await confirmPasswordReset(auth, actionCode, newPassword);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: getFirebaseErrorMessage(handleAuthErrors(error).error.code),
    };
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.log(error);
  }
};

export const verifyEmail = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
  } catch (error: any) {
    console.log("error updating user verification status!", error.message);
  }
};

export const logOut = async () => {
  await signOut(auth);
};

/*  export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  // ... implementation
};


export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}} */
