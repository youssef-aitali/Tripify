import ConfirmEmailBanner from "@/components/custom/ConfirmEmailBanner";
import { useAuthUser } from "@/contexts/AuthContext";
import { sendVerificationEmail } from "@/features/auth/services/authService";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();
  const hasChecked = useRef(false);
  const [showConfirmBanner, setShowConfirmBanner] = useState(false);

  const handleResendConfirmationEmail = async () => {
    currentUser && (await sendVerificationEmail(currentUser));
  };

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const verifyEmail = async () => {
      try {
        await currentUser?.reload();
        setShowConfirmBanner(!currentUser?.emailVerified!!);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    verifyEmail();
  }, []);

  console.log(currentUser?.emailVerified);

  return (
    <div>
      {showConfirmBanner && (
        <ConfirmEmailBanner
          resendVerificationEmail={handleResendConfirmationEmail}
        />
      )}
      <div>Welcome Page</div>
    </div>
  );
};

export default DashboardPage;
