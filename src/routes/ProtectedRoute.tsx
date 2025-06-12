import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isCurrentUserLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "Inside protected route, is currentUserLoading --> ",
      isCurrentUserLoading
    );
    console.log("Inside protected route, current User --> ", currentUser);
    if (!currentUser) navigate("/");
  }, [currentUser]);

  if (isCurrentUserLoading) {
    return <LoadingSkeleton />;
  }
  return currentUser ? children : null;
};

export default ProtectedRoute;
