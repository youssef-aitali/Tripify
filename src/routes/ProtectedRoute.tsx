import { AuthContext, useAuthUser } from "@/contexts/AuthContext";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (currentUser) {
    return children;
  }
  return null;
};

export default ProtectedRoute;
