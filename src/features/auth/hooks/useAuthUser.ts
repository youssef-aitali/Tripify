import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuthUser = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthUser must be used withing AuthProvider");
  return context;
};
