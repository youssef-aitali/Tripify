import type { AuthUser, CurrentUserType } from "@/features/auth/authTypes";
import {
  createAuthUser,
  getUserProfile,
} from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import { createContext, useEffect, useState, type ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  currentUser: AuthUser | null;
  setCurrentUser: (value: React.SetStateAction<AuthUser | null>) => void;
  isCurrentUserLoading: boolean;
}>({
  currentUser: null,
  setCurrentUser: () => {},
  isCurrentUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getUserProfile(user.uid);
          const authUser = createAuthUser(user);
          setCurrentUser({
            ...authUser,
            ...userData,
            emailVerified: user.emailVerified,
          });
          console.log("Inside Context: --> setting user to data");
        } else {
          console.log("Inside Context: --> setting user to null");
          setCurrentUser(null);
        }
        setIsCurrentUserLoading(false);
      });
      console.log(
        "Inside Context: --> setting to is currentCurrentUserLoading to false"
      );
      return unsubscribeAuth;
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isCurrentUserLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
