import { useState } from "react";
import {
  loginWithEmailAndPassword,
  setNewPassword,
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
  });

  const handleAuthFlow = async (
    authFn: () => Promise<AuthResult>,
    type: "email" | "google"
  ) => {
    setAuthLoading({ ...authLoading, [`${type}AuthLoading`]: true });

    const result = await authFn();

    setAuthLoading({ ...authLoading, [`${type}AuthLoading`]: false });

    if (result.error) {
      return {
        success: false,
        errorMessage: getFirebaseErrorMessage(result.error.code),
      };
    }

    return { success: true, user: result.user };
  };

  const emailSignUp = (email: string, password: string, username: string) =>
    handleAuthFlow(
      () => signUpWithEmailAndPassword(email, password, username),
      "email"
    );

  const emailLogIn = (email: string, password: string) =>
    handleAuthFlow(() => loginWithEmailAndPassword(email, password), "email");

  const googleSignUp = () => handleAuthFlow(signUpWithGoogle, "google");

  const googleSignIn = () => handleAuthFlow(signInWithGoogle, "google");

  return { emailSignUp, googleSignUp, emailLogIn, googleSignIn, authLoading };
};
