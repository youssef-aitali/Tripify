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
  isLoading: boolean;
}>({
  currentUser: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthCurrentUser must be used withing AuthProvider");
  return context;
};
