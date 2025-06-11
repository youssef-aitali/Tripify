import type { AuthUser } from "@/features/auth/authTypes";
import { getUserProfile } from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import { createContext, useEffect, useState, type ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  dbCurrentUser: DocumentData | AuthUser | null;
  isCurrentUserLoading: boolean;
}>({
  dbCurrentUser: null,
  isCurrentUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [dbCurrentUser, setCurrentUser] = useState<
    DocumentData | AuthUser | null
  >(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getUserProfile(user.uid);
          setCurrentUser(
            userData || {
              fullname: user.displayName || "Anonymous",
              username: user.email!.split("@")[0],
              email: user.email,
              emailVerified: user.emailVerified,
              avatarUrl: user.photoURL || "",
              preferences: {
                language: "English",
                appearance: "Light",
                notifications: true,
              },
            }
          );
        } else {
          setCurrentUser(user);
        }
        setIsCurrentUserLoading(false);
      });

      return unsubscribeAuth;
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ dbCurrentUser, isCurrentUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
