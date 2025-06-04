import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useContext(AuthContext);
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
