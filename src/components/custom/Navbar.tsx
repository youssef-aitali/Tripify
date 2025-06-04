import { useContext, useState } from "react";

import logo from "@/assets/logo.svg";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/features/auth/components/SignUpDialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import userIcon from "@/assets/icons/user.svg?url";
import { IconSettings } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";

import SendResetPasswordDialog from "@/features/auth/components/SendResetPasswordDialog";
import type { OutletProps } from "@/features/auth/authTypes";
import { AuthContext } from "@/contexts/AuthContext";
import { logOut } from "@/features/auth/services/authService";

const Navbar = ({ isLogInDialogOpen, setIsLogInDialogOpen }: OutletProps) => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isSendResetPasswordDialogOpen, setIsSendResetPasswordDialogOpen] =
    useState(false);

  const { currentUser, isLoading } = useContext(AuthContext);

  const logOutHandler = async () => {
    await logOut();
  };

  return (
    <div className="flex justify-between items-center h-16 border-b-1 border-gray-200 px-[20%]">
      <img className="w-24" src={logo} alt="Tripify logo" />
      {isLoading ? (
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : currentUser ? (
        <span className="flex items-center gap-4">
          <IconBell
            stroke={2}
            className="text-cyan-900/90 hover:text-cyan-900 cursor-pointer"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
                <AvatarImage src={userIcon} alt="User avatar" />
                <AvatarFallback className="rounded-full">CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconUser stroke={2} />
                  My profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconSettings stroke={2} /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logOutHandler}>
                <IconLogout stroke={2} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      ) : (
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
            onSendResetPasswordDialogOpenChange={
              setIsSendResetPasswordDialogOpen
            }
          />
          <SignUpDialog
            isSignUpDialogOpen={isSignUpDialogOpen}
            onSignUpDialogOpenChange={setIsSignUpDialogOpen}
            onLogInDialogOpenChange={setIsLogInDialogOpen}
          />
          <SendResetPasswordDialog
            isSendResetPasswordDialogOpen={isSendResetPasswordDialogOpen}
            onSendResetPasswordDialogOpenChange={
              setIsSendResetPasswordDialogOpen
            }
            onLogInDialogOpenChange={setIsLogInDialogOpen}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
