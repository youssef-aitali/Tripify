import { toast } from "sonner";

import ConfirmEmailBanner from "@/features/auth/components/ConfirmEmailBanner";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();

  const {
    sendEmailVerification,
    authLoading: { sendEmailVerificationLoading },
  } = useAuth();

  const handleResendConfirmationEmail = async () => {
    const result = await sendEmailVerification();

    if (result.success) {
      toast.info("Confirmation email sent. Check your inbox!");
    } else {
      toast.error(result.errorMessage);
    }
  };

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
