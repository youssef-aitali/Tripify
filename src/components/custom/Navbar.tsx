import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IconSettings } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";

import SendResetPasswordDialog from "@/features/auth/components/SendResetPasswordDialog";
import type { OutletProps } from "@/features/auth/authTypes";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/features/auth/components/SignUpDialog";
import { logOut } from "@/features/auth/services/authService";
import NavbarItemSkeleton from "@/components/custom/NavbarItemSkeleton";
import TButton from "@/components/custom/TButton";
import userAvatar from "@/assets/icons/user.svg?url";
import { useAuthUser } from "@/contexts/AuthContext";
import Tripifylogo from "@/assets/logo.svg";

const Navbar = ({ isLogInDialogOpen, setIsLogInDialogOpen }: OutletProps) => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isSendResetPasswordDialogOpen, setIsSendResetPasswordDialogOpen] =
    useState(false);

  const { currentUser, isCurrentUserLoading } = useAuthUser();

  const logOutHandler = async () => {
    await logOut();
  };

  return (
    <div className="flex justify-between items-center h-16 border-b-1 border-gray-200 px-[20%]">
      <img className="w-24" src={Tripifylogo} alt="Tripify logo" />
      {isCurrentUserLoading ? (
        <NavbarItemSkeleton />
      ) : currentUser ? (
        <div className="flex items-center gap-4">
          <IconBell
            stroke={2}
            className="text-cyan-900/90 hover:text-cyan-900 cursor-pointer"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
                <AvatarImage src={userAvatar} alt="User avatar" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <IconUser stroke={2} /> My profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <IconSettings stroke={2} /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={logOutHandler}
                >
                  <IconLogout stroke={2} /> Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-4">
          <TButton variant="ghost" onClick={() => setIsLogInDialogOpen(true)}>
            Login
          </TButton>
          <TButton onClick={() => setIsSignUpDialogOpen(true)}>Sign up</TButton>
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
