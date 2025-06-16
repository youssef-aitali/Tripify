import { createContext } from "react";

import type { AuthUser } from "@/features/auth/authTypes";
import type { User } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";

type AuthContextType = {
  /* currentUser: AuthUser | null; */
  currentUser: User | null;
  setCurrentUser: (value: React.SetStateAction<User | null>) => void;
  isCurrentUserLoading: boolean;
  userData: DocumentData | AuthUser | undefined;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isCurrentUserLoading: true,
  userData: undefined,
});
