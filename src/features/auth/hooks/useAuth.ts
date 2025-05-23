import { useState } from "react";
import {
  getFriendlyErrorMessage,
  signUpWithEmailAndPassword,
  signUpWithGoogle,
} from "../services/authService";

export const useAuth = () => {
  const [emailSignUpLoading, SetEmailSignUpLoading] = useState(false);
  const [googleSignUpLoading, SetGoogleSignUpLoading] = useState(false);

  const emailSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    SetEmailSignUpLoading(true);

    const result = await signUpWithEmailAndPassword(email, password, username);

    SetEmailSignUpLoading(false);

    if (result.firebaseError) {
      return {
        success: false,
        errorMessage: getFriendlyErrorMessage(result.firebaseError.code),
      };
    }

    return { success: true, user: result.user };
  };

  const googleSginUp = async () => {
    SetGoogleSignUpLoading(true);

    const result = await signUpWithGoogle();

    SetGoogleSignUpLoading(false);

    if (result.firebaseError) {
      return {
        success: false,
        errorMessage: getFriendlyErrorMessage(result.firebaseError.code),
      };
    }

    return { success: true, user: result.user };
  };

  return { emailSignUp, emailSignUpLoading, googleSginUp, googleSignUpLoading };
};
