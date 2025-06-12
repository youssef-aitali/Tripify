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

  console.log(
    "inside protected route, is current user still loading? = ",
    isCurrentUserLoading
  );
  console.log("inside protected route, current user = ", currentUser);

  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  if (isCurrentUserLoading) {
    return <LoadingSkeleton />;
  }

  return currentUser ? children : null;
};

export default ProtectedRoute;
