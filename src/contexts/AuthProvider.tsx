import type { AuthUser } from "@/features/auth/authTypes";
import {
  createAuthUser,
  getUserProfile,
} from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { DocumentData } from "firebase/firestore";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  //const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);
  const [userData, setUserData] = useState<DocumentData | undefined>(undefined);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          const userData = await getUserProfile(user.uid);
          setUserData(userData);
          console.log("DOCUMENT DATA: ", userData);
        } else {
          setCurrentUser(null);
          setUserData(undefined);
        }
        setIsCurrentUserLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    });
    return unsubscribeAuth;

    /*  try {
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
    } */
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isCurrentUserLoading, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
