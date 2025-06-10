import type { AuthUser } from "@/features/auth/authTypes";
import { getUserProfile } from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  currentUser: DocumentData | AuthUser | null;
  isCurrentUserLoading: boolean;
}>({
  currentUser: null,
  isCurrentUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<
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
              avatarUrl: "",
              preferences: {
                language: "English",
                appearance: "Light",
                notifications: true,
              },
            }
          );
          console.log("User Data From FireStore: ", userData);
        }
        setCurrentUser(user);
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

export const useAuthUser = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthUser must be used withing AuthProvider");
  return context;
};
