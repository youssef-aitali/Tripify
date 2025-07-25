import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconSettingsCode } from "@tabler/icons-react";
import { IconDashboard } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import SendResetPasswordDialog from "@/features/auth/components/SendResetPasswordDialog";
import type { OutletProps } from "@/features/authTypes";
import LogInDialog from "@/features/auth/components/LogInDialog";
import SignUpDialog from "@/features/auth/components/SignUpDialog";
import { logOut } from "@/features/auth/services/authService";
import NavbarItemSkeleton from "@/components/custom/NavbarItemSkeleton";
import TButton from "@/components/custom/TButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATHS } from "@/routes/routePaths";
import Logo from "@/components/custom/Logo";

const Navbar = ({ isLogInDialogOpen, setIsLogInDialogOpen }: OutletProps) => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isSendResetPasswordDialogOpen, setIsSendResetPasswordDialogOpen] =
    useState(false);

  const { currentUser, userData, isCurrentUserLoading } = useAuthUser();
  const navigate = useNavigate();

  const { t } = useTranslation("auth");

  const logOutHandler = async () => {
    await logOut();
    navigate(ROUTE_PATHS.PLAN_TRIP);
  };

  return (
    <div className="flex justify-between items-center h-16 border-b-1 border-gray-200 px-[20%]">
      {/* <img className="w-24" src={Tripifylogo} alt="Tripify logo" /> */}
      <Logo className="w-24 text-tprimary" />
      {isCurrentUserLoading ? (
        <NavbarItemSkeleton />
      ) : currentUser ? (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconBell
                stroke={2}
                className="text-tprimary hover:text-accent cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="end">
              <DropdownMenuLabel className="text-base">
                {t("Notifications")}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-sm text-center font-normal px-2">
                {t("Empty Notifications")}
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                  src={userData?.photoURL || currentUser.photoURL || undefined}
                  alt="User avatar"
                />
                <AvatarFallback
                  className="bg-gray-400 text-lg font-semibold text-white"
                  delayMs={1500}
                >
                  {userData?.username?.[0].toUpperCase() ??
                    currentUser.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <IconDashboard />
                  <Link to={ROUTE_PATHS.DASHBOARD}>{t("Dashboard")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <IconSettingsCode />
                  <Link to={ROUTE_PATHS.ACCOUNT}>{t("Settings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={logOutHandler}
                >
                  <IconLogout /> {t("Log out")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-4">
          <TButton variant="ghost" onClick={() => setIsLogInDialogOpen(true)}>
            {t("Log in")}
          </TButton>
          <TButton onClick={() => setIsSignUpDialogOpen(true)}>
            {t("Sign up")}
          </TButton>
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
