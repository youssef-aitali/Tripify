import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import PlanTripPage from "@/pages/PlanTripPage";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { dbCurrentUser, isCurrentUserLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCurrentUserLoading && !dbCurrentUser) {
      navigate("/");
    }
  }, [dbCurrentUser, isCurrentUserLoading]);

  if (!isCurrentUserLoading) {
    return !dbCurrentUser ? <PlanTripPage /> : children;
  } else {
    <LoadingSkeleton />;
  }
};

export default ProtectedRoute;
