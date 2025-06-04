import { AuthContext } from "@/contexts/AuthContext";
import { useContext, type ReactNode } from "react";
import { useNavigate } from "react-router";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (currentUser) {
    return children;
  }

  navigate("/");
};

export default ProtectedRoute;
