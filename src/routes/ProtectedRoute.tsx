import { useEffect, type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router";

import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ROUTE_PATHS } from "./routePaths";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { currentUser, isCurrentUserLoading } = useAuthUser();

  useEffect(() => {
    if (!currentUser && !isCurrentUserLoading) navigate(ROUTE_PATHS.PLAN_TRIP);
  }, [currentUser, isCurrentUserLoading]);
  if (isCurrentUserLoading) {
    return <LoadingSkeleton />;
  }
  return currentUser ? children : null;
};

export default ProtectedRoute;
