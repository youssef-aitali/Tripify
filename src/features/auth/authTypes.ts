import type { User } from "firebase/auth";

export type SignUpDialogProps = {
  isSignUpDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
  onLogInDialogOpenChange: (open: boolean) => void;
};

export type LogInDialogProps = {
  isLogInDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
  onLogInDialogOpenChange: (open: boolean) => void;
  onSendResetPasswordDialogOpenChange: (open: boolean) => void;
};

export type SendResetPasswordDialogProps = {
  isSendResetPasswordDialogOpen: boolean;
  onSendResetPasswordDialogOpenChange: (open: boolean) => void;
  onLogInDialogOpenChange: (open: boolean) => void;
};

export type UserPreferences = {
  language: string;
  appearance: string;
  notifications: boolean;
};

export type AuthUser = {
  fullname: string;
  username: string | undefined;
  email: string | null;
  emailVerified: boolean;
  photoURL: string;
  preferences: UserPreferences;
};

export type AuthErrorResponse = {
  code: string;
  message?: string;
};

export type AuthResult =
  | AuthErrorResponse
  | {
      user: User;
    }
  | void;

export type OutletProps = {
  isLogInDialogOpen: boolean;
  setIsLogInDialogOpen: (isDialogOpen: boolean) => void;
};
