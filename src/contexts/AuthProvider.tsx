import type { AuthUser } from "@/features/auth/authTypes";
import {
  createAuthUser,
  getUserProfile,
} from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        !isCurrentUserLoading && setIsCurrentUserLoading(true);
        if (user) {
          const userData = await getUserProfile(user.uid);
          const authUser = createAuthUser(user);
          console.log("Inside Context: --> setting user to data");
          setCurrentUser({
            ...authUser,
            ...userData,
            emailVerified: user.emailVerified,
          });
        } else {
          console.log("Inside Context: --> setting user to null");
          setCurrentUser(null);
        }
        console.log(
          "Inside Context: --> setting to is currentCurrentUserLoading to false"
        );
        setIsCurrentUserLoading(false);
      });
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

export default AuthProvider;
