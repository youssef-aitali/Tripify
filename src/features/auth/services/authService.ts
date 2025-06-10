import { auth, googleProvider } from "@/lib/firebase/firebaseConfig";

import {
  applyActionCode,
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
  handleAuthErrors,
  isUserEmailAlreadyUsed,
  registerNewUser,
} from "@/features/auth/utils/authUtils";

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
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

    console.log("Email & Password sign up: ", user);

    await registerNewUser(user.displayName, email, user.uid);

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

    console.log("Email & Password sign up: ", user);
    await registerNewUser(user.displayName, user.email!, user.uid);
    console.log("stored in firebase");
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
    return handleAuthErrors(error);
  }
};

export const checkResetLinkValidity = async (actionCode: string) => {
  try {
    const email = await verifyPasswordResetCode(auth, actionCode);
    return email;
  } catch (error) {
    console.error("Operation failed:", error);
  }
};

export const setNewPassword = async (
  actionCode: string,
  newPassword: string
) => {
  try {
    await confirmPasswordReset(auth, actionCode, newPassword);
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const verifyEmail = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Operation failed:", error);
  }
};
