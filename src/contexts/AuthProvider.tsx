import { createUserData } from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import type { AuthUser } from "@/features/authTypes";

import { doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import i18n from "i18next";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);
  const [userData, setUserData] = useState<DocumentData | AuthUser | undefined>(
    undefined
  );

  useEffect(() => {
    let unsubscribeSnapshot: Unsubscribe;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          /* const userData = await getUserProfile(user.uid);
          setUserData(userData ?? createUserData(user));
          */
          unsubscribeSnapshot = onSnapshot(
            doc(db, "users", user.uid),
            (doc) => {
              setUserData(doc.exists() ? doc.data() : createUserData(user));
              i18n.changeLanguage(
                doc.exists() ? doc.data().preferences.language : i18n.language
              );
            }
          );
        } else {
          setCurrentUser(null);
          setUserData(undefined);
        }
        setIsCurrentUserLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    });
    return () => {
      unsubscribeAuth;
      unsubscribeSnapshot;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isCurrentUserLoading,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
