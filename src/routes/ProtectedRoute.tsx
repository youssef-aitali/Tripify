import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/contexts/AuthContext";
import PlanTripPage from "@/pages/PlanTripPage";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isCurrentUserLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, isCurrentUserLoading]);

  if (!isCurrentUserLoading) {
    return !currentUser ? <PlanTripPage /> : children;
  } else {
    <LoadingSkeleton />;
  }
};

export default ProtectedRoute;
