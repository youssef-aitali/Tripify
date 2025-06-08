import ConfirmEmailBanner from "@/components/custom/ConfirmEmailBanner";
import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuthUser } from "@/contexts/AuthContext";
import { sendVerificationEmail } from "@/features/auth/services/authService";
import { useEffect, useRef, useState } from "react";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();
  const hasChecked = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleResendConfirmationEmail = async () => {
    currentUser && (await sendVerificationEmail(currentUser));
  };

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const verifyEmail = async () => {
      try {
        await currentUser?.reload();
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    };

    verifyEmail();
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      {!currentUser?.emailVerified && (
        <ConfirmEmailBanner
          resendVerificationEmail={handleResendConfirmationEmail}
        />
      )}
      <div>Welcome Page</div>
    </div>
  );
};

export default DashboardPage;
