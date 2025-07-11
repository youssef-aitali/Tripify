import { useState } from "react";
import {
  loginWithEmailAndPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  setNewPassword,
  signInWithGoogle,
  signUpWithEmailAndPassword,
} from "@/features/auth/services/authService";

import { getFirebaseErrorMessage } from "@/features/auth/utils/authUtils";
import type { AuthResult } from "@/features/authTypes";

export const useAuth = () => {
  const [authLoading, setAuthLoading] = useState({
    emailAuthLoading: false,
    googleAuthLoading: false,
    sendResetPasswordEmailLoading: false,
    setNewPasswordLoading: false,
    sendEmailVerificationLoading: false,
  });

  const handleAuthFlow = async (
    authFn: () => Promise<AuthResult>,
    type:
      | "emailAuth"
      | "googleAuth"
      | "sendResetPasswordEmail"
      | "setNewPassword"
      | "sendEmailVerification"
  ) => {
    setAuthLoading({ ...authLoading, [`${type}Loading`]: true });

    const result = await authFn();

    setAuthLoading({ ...authLoading, [`${type}Loading`]: false });

    if (result && "code" in result) {
      return {
        success: false,
        errorMessage: getFirebaseErrorMessage(result.code),
      };
    }

    return { success: true, user: result?.user };
  };

  const emailSignUp = (email: string, password: string) =>
    handleAuthFlow(
      () => signUpWithEmailAndPassword(email, password),
      "emailAuth"
    );

  const emailLogIn = (email: string, password: string) =>
    handleAuthFlow(
      () => loginWithEmailAndPassword(email, password),
      "emailAuth"
    );

  const googleSignIn = () => handleAuthFlow(signInWithGoogle, "googleAuth");

  const sendPasswordResetEmail = (email: string) =>
    handleAuthFlow(
      () => sendResetPasswordEmail(email),
      "sendResetPasswordEmail"
    );

  const confirmNewPassword = (actionCode: string, newPassword: string) =>
    handleAuthFlow(
      () => setNewPassword(actionCode, newPassword),
      "setNewPassword"
    );

  const sendEmailVerification = () =>
    handleAuthFlow(sendVerificationEmail, "sendEmailVerification");

  return {
    emailSignUp,
    emailLogIn,
    googleSignIn,
    sendPasswordResetEmail,
    confirmNewPassword,
    sendEmailVerification,
    authLoading,
  };
};
