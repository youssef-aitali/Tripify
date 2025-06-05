import { verifyEmail } from "@/features/auth/services/authService";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

const AuthActionsHandlerPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!mode || !actionCode) return;
    if (hasChecked.current) return;
    hasChecked.current = true;

    const handleActionsRedirection = async () => {
      try {
        if (mode === "verifyEmail") {
          await verifyEmail(actionCode);
          navigate("/dashboard");
        } else {
          navigate("/passwordreset");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    handleActionsRedirection();
  }, []);

  return <p>Processing your request...</p>;
};

export default AuthActionsHandlerPage;
