import { useState } from "react";
import {
  loginWithEmailAndPassword,
  sendResetPasswordEmail,
  signInWithGoogle,
  signUpWithEmailAndPassword,
  signUpWithGoogle,
} from "@/features/auth/services/authService";

import { getFirebaseErrorMessage } from "@/features/auth/utils/authUtils";
import type { AuthResult } from "@/features/auth/authTypes";

export const useAuth = () => {
  const [authLoading, setAuthLoading] = useState({
    emailAuthLoading: false,
    googleAuthLoading: false,
    sendResetPasswordEmailLoading: false,
  });

  const handleAuthFlow = async (
    authFn: () => Promise<AuthResult | void>,
    type: "emailAuth" | "googleAuth" | "sendResetPasswordEmail"
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

  const emailSignUp = (email: string, password: string, username: string) =>
    handleAuthFlow(
      () => signUpWithEmailAndPassword(email, password, username),
      "emailAuth"
    );

  const emailLogIn = (email: string, password: string) =>
    handleAuthFlow(
      () => loginWithEmailAndPassword(email, password),
      "emailAuth"
    );

  const googleSignUp = () => handleAuthFlow(signUpWithGoogle, "googleAuth");

  const googleSignIn = () => handleAuthFlow(signInWithGoogle, "googleAuth");

  const sendPasswordResetEmail = (email: string) =>
    handleAuthFlow(
      () => sendResetPasswordEmail(email),
      "sendResetPasswordEmail"
    );

  return {
    emailSignUp,
    googleSignUp,
    emailLogIn,
    googleSignIn,
    sendPasswordResetEmail,
    authLoading,
  };
};
