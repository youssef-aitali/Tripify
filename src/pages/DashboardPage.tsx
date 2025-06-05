import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
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

    verifyEmail(); // Call the async function
  }, []);

  return <div>Welcome Page</div>;
};

export default DashboardPage;
