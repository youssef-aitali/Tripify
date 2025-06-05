import { useAuthUser } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { currentUser } = useAuthUser();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const verifyEmail = async () => {
      try {
        await currentUser?.reload();
        !currentUser?.emailVerified &&
          toast.warning("Please confirm your email!");
      } catch (error) {
        console.error("Error:", error);
      }
    };

    verifyEmail();
  }, []);

  return <div>Welcome Page</div>;
};

export default DashboardPage;
