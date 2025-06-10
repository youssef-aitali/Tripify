import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ConfirmEmailBanner from "@/components/custom/ConfirmEmailBanner";
import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();
  const {
    sendEmailVerification,
    authLoading: { sendEmailVerificationLoading },
  } = useAuth();
  const hasChecked = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleResendConfirmationEmail = async () => {
    const result = await sendEmailVerification(currentUser!);

    if (result.success) {
      toast.info("Confirmation email sent. Check your inbox!");
    } else {
      toast.error(result.errorMessage);
    }
  };

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const reloadCurrentUser = async () => {
      try {
        await currentUser?.reload();
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    };

    reloadCurrentUser();
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      {!currentUser?.emailVerified && (
        <ConfirmEmailBanner
          resendVerificationEmail={handleResendConfirmationEmail}
          isSendButtonLoading={sendEmailVerificationLoading}
        />
      )}
      <div>Welcome Page</div>
    </div>
  );
};

export default DashboardPage;
