import { auth, googleProvider } from "@/lib/firebaseConfig";

import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";

import {
  handleAuthErrors,
  isUserDocAlreadyExists,
  isUserEmailAlreadyUsed,
  registerNewUser,
} from "@/features/auth/utils/authUtils";
import { playConfettiAnimation } from "@/features/auth/utils/playConfettiAnimation";

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

    /*  if (isEmailUsed) {
         throw {
        code: "auth/email-already-in-use",
      };
    } */

    await registerNewUser(user);
    await sendVerificationEmail();

    return { user };
  } catch (error) {
    console.log(error);
    const usedMethodsForEmail = await fetchSignInMethodsForEmail(auth, email);
    return handleAuthErrors(error, usedMethodsForEmail);
    /*  if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/email-already-in-use"
    ) {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes("google.com")) {
        return handleAuthErrors({ error, existingEmailMethod: methods[0] });
      } else {
        return handleAuthErrors({ error });
      }
    } */
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
    console.log(error);
    return handleAuthErrors(error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    /* const isEmailUsed = await isUserEmailAlreadyUsed(user.email!);

    if (isEmailUsed) {
      throw {
        code: "auth/email-already-in-use",
      };
    }
    */

    await registerNewUser(user);

    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
};

/* export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    return { user };
  } catch (error) {
    return handleAuthErrors(error);
  }
}; */

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

export const sendVerificationEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser!);
  } catch (error) {
    return handleAuthErrors(error);
  }
};

export const verifyEmail = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
    await auth.currentUser?.reload();
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
