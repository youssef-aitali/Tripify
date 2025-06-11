import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import PlanTripPage from "@/pages/PlanTripPage";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isCurrentUserLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("is current user loading", isCurrentUserLoading);
    console.log("current user: ", currentUser);
    console.log("test is : ", !isCurrentUserLoading && !currentUser);
    if (!isCurrentUserLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, isCurrentUserLoading]);

  if (isCurrentUserLoading) {
    return <LoadingSkeleton />;
  }
  return currentUser ? children : null;
};

export default ProtectedRoute;
