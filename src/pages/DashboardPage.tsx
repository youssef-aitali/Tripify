import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ConfirmEmailBanner from "@/components/custom/ConfirmEmailBanner";
import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { auth } from "@/lib/firebase/firebaseConfig";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();
  const authCurrentUser = auth.currentUser;
  const {
    sendEmailVerification,
    authLoading: { sendEmailVerificationLoading },
  } = useAuth();
  const hasChecked = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleResendConfirmationEmail = async () => {
    const result = await sendEmailVerification();

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
        await authCurrentUser?.reload();
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
      {!authCurrentUser?.emailVerified && (
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
