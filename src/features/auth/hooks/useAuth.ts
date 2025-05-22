import { useState } from "react";
import {
  getFriendlyErrorMessage,
  signUpWithEmailAndPassword,
} from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const registerUser = async (
    email: string,
    password: string,
    username: string
  ) => {
    setLoading(true);

    const result = await signUpWithEmailAndPassword(email, password, username);

    setLoading(false);

    if (result.firebaseError) {
      return {
        success: false,
        errorMessage: getFriendlyErrorMessage(result.firebaseError.code),
      };
    }

    return { success: true, user: result.user };
  };

  return { registerUser, loading };
};
