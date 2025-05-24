import { useState } from "react";
import {
  signUpWithEmailAndPassword,
  signUpWithGoogle,
} from "@/features/auth/services/authService";

import { getFirebaseErrorMessage } from "@/features/auth/services/authErrors";
import type { AuthResult } from "../authTypes";

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

    if (result.firebaseError) {
      return {
        success: false,
        errorMessage: getFirebaseErrorMessage(result.firebaseError.code),
      };
    }
    return { success: true, user: result.user };
  };

  const emailSignUp = (email: string, password: string, username: string) =>
    handleAuthFlow(
      () => signUpWithEmailAndPassword(email, password, username),
      "email"
    );

  const googleSignUp = () => handleAuthFlow(signUpWithGoogle, "google");

  return { emailSignUp, googleSignUp, authLoading };

  // const [emailSignUpLoading, setEmailSignUpLoading] = useState(false);
  // const [googleSignUpLoading, setGoogleSignUpLoading] = useState(false);

  // const emailSignUp = async (
  //   email: string,
  //   password: string,
  //   username: string
  // ) => {
  //   setEmailSignUpLoading(true);

  //   const result = await signUpWithEmailAndPassword(email, password, username);

  //   setEmailSignUpLoading(false);

  //   if (result.firebaseError) {
  //     return {
  //       success: false,
  //       errorMessage: getFirebaseErrorMessage(result.firebaseError.code),
  //     };
  //   }

  //   return { success: true, user: result.user };
  // };

  // const googleSignUp = async () => {
  //   setGoogleSignUpLoading(true);

  //   const result = await signUpWithGoogle();

  //   setGoogleSignUpLoading(false);

  //   if (result.firebaseError) {
  //     return {
  //       success: false,
  //       errorMessage: getFirebaseErrorMessage(result.firebaseError.code),
  //     };
  //   }

  //   return { success: true, user: result.user };
  // };

  // return { emailSignUp, emailSignUpLoading, googleSignUp, googleSignUpLoading };
};
