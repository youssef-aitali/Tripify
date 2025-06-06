import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { verifyEmail } from "@/features/auth/services/authService";
import { ROUTE_PATHS } from "@/routes/routePaths";

const AuthActionsHandlerPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    if (!mode || !actionCode) return;

    const handleActionsRedirection = async () => {
      try {
        if (mode === "verifyEmail") {
          await verifyEmail(actionCode);
          navigate(ROUTE_PATHS.DASHBOARD);
        } else {
          navigate(`${ROUTE_PATHS.PASSWORD_RESET}?oobCode=${actionCode}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    handleActionsRedirection();
  }, []);

  return null;
};

export default AuthActionsHandlerPage;
