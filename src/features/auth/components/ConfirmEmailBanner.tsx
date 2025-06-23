import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

import TButton from "@/components/custom/TButton";

type ConfirmEmailBannerProps = {
  resendVerificationEmail: () => void;
  isSendButtonLoading: boolean;
};

const ConfirmEmailBanner = ({
  resendVerificationEmail,
  isSendButtonLoading,
}: ConfirmEmailBannerProps) => {
  return (
    <Alert className="border-orange-200 bg-orange-100 text-orange-600 font-semibold">
      <IconAlertCircle stroke={3} />
      <AlertDescription className="text-orange-600 font-semibold flex items-center justify-between">
        Check your inbox to verify your email!
        <TButton
          variant="link"
          className="font-semibold text-orange-600 hover:text-orange-700"
          onClick={resendVerificationEmail}
          disabled={isSendButtonLoading}
        >
          Resend Email
        </TButton>
      </AlertDescription>
    </Alert>
  );
};

export default ConfirmEmailBanner;
