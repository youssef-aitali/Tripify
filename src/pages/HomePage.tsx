import { useState } from "react";

import logo from "@/assets/logo.svg";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/features/auth/components/SignUpDialog";

import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

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
            onSignUpDialogOpenChange={setIsSignUpDialogOpen}
            onLogInDialogOpenChange={setIsLogInDialogOpen}
          />
          <SignUpDialog
            isSignUpDialogOpen={isSignUpDialogOpen}
            onSignUpDialogOpenChange={setIsSignUpDialogOpen}
            onLogInDialogOpenChange={setIsLogInDialogOpen}
          />
        </div>
      </div>
      <div className="bg-gray-200 grow">Content</div>
      <Toaster
        toastOptions={{
          style: {
            background: "hsl(0, 72%, 51%)",
            color: "white",
            border: "1px solid hsl(0, 85%, 35%)",
          },
        }}
      />
    </div>
  );
};

export default HomePage;
