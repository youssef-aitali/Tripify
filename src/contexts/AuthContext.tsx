import { getUserProfile } from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
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
  currentUser: User | null;
  isCurrentUserLoading: boolean;
}>({
  currentUser: null,
  isCurrentUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed");
        if (user) {
          const userData = await getUserProfile(user.uid);
          console.log(userData);
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
