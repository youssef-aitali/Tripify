import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/SignUpDialog";
import { useState } from "react";

const HomePage = () => {
  const [isLogInDialogOpen, setIsLogInDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-svh px-[20%]">
      <div className="flex justify-between items-center h-16 w-full">
        <img className="w-24" src={logo} alt="Tripify logo" />
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="hover:bg-gray-200/50 cursor-pointer"
            onClick={() => setIsLogInDialogOpen(true)}
          >
            Login
          </Button>
          <Button
            className="bg-cyan-900/90 hover:bg-cyan-900 cursor-pointer"
            onClick={() => setIsSignUpDialogOpen(true)}
          >
            Sign up
          </Button>
          <LogInDialog
            isLogInDialogOpen={isLogInDialogOpen}
            onLogInDialogOpenChange={setIsLogInDialogOpen}
          />
          <SignUpDialog
            isSignUpDialogOpen={isSignUpDialogOpen}
            onSignUpDialogOpenChange={setIsSignUpDialogOpen}
          />
        </div>
      </div>
      <div className="bg-gray-200 grow">Content</div>
    </div>
  );
};

export default HomePage;
