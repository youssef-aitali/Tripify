import { useState } from "react";

import logo from "@/assets/logo.svg";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/features/auth/components/SignUpDialog";

import { Button } from "@/components/ui/button";

import SendResetPasswordDialog from "@/features/auth/components/SendResetPasswordDialog";
import type { OutletProps } from "@/features/auth/authTypes";

const Navbar = ({ isLogInDialogOpen, setIsLogInDialogOpen }: OutletProps) => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isSendResetPasswordDialogOpen, setIsSendResetPasswordDialogOpen] =
    useState(false);

  return (
    <div className="flex justify-between items-center h-16 border-b-1 border-gray-200 px-[20%]">
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
          onSendResetPasswordDialogOpenChange={setIsSendResetPasswordDialogOpen}
        />
        <SignUpDialog
          isSignUpDialogOpen={isSignUpDialogOpen}
          onSignUpDialogOpenChange={setIsSignUpDialogOpen}
          onLogInDialogOpenChange={setIsLogInDialogOpen}
        />
        <SendResetPasswordDialog
          isSendResetPasswordDialogOpen={isSendResetPasswordDialogOpen}
          onSendResetPasswordDialogOpenChange={setIsSendResetPasswordDialogOpen}
          onLogInDialogOpenChange={setIsLogInDialogOpen}
        />
      </div>
    </div>
  );
};

export default Navbar;
