import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { verifyEmail } from "@/features/auth/services/authService";
import { ROUTE_PATHS } from "@/routes/routePaths";
import {
  getFirebaseErrorMessage,
  persistEmailVerification,
} from "@/features/auth/utils/authUtils";
import { auth } from "@/lib/firebase/firebaseConfig";

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
      if (mode === "verifyEmail") {
        const result = await verifyEmail(actionCode);
        if (result && "code" in result) {
          toast.error(getFirebaseErrorMessage(result.code));
        } else {
          auth.currentUser &&
            (await persistEmailVerification(auth.currentUser.uid));
          toast.success("Email verified! 🎉 Welcome aboard.");
        }
        navigate(ROUTE_PATHS.DASHBOARD);
      } else {
        navigate(`${ROUTE_PATHS.PASSWORD_RESET}?oobCode=${actionCode}`);
      }
    };

    handleActionsRedirection();
  }, []);

  return null;
};

export default AuthActionsHandlerPage;
