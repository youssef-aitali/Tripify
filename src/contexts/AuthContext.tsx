import type { AuthUser, CurrentUserType } from "@/features/auth/authTypes";
import { getUserProfile } from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import { createContext, useEffect, useState, type ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  currentUser: CurrentUserType | null;
  isCurrentUserLoading: boolean;
}>({
  currentUser: null,
  isCurrentUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getUserProfile(user.uid);
          console.log({
            ...user,
            ...userData,
            username: user.email?.split("@")[0],
          });
          setCurrentUser({
            ...user,
            ...userData,
            username: user.email?.split("@")[0],
          });
        } else {
          setCurrentUser(null);
        }
        setIsCurrentUserLoading(false);
      });

      return unsubscribeAuth;
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isCurrentUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
