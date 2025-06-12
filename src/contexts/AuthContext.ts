import { createContext } from "react";

import type { AuthUser } from "@/features/auth/authTypes";

type AuthContextType = {
  currentUser: AuthUser | null;
  setCurrentUser: (value: React.SetStateAction<AuthUser | null>) => void;
  isCurrentUserLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isCurrentUserLoading: true,
});
