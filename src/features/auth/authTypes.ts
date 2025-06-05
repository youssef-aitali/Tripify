import { type User } from "firebase/auth";

export type AuthInputs = {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

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

export type AuthErrorResponse = {
  code: string;
  message?: string;
};

export type AuthResult =
  | AuthErrorResponse
  | {
      user: User;
    };

export type OutletProps = {
  isLogInDialogOpen: boolean;
  setIsLogInDialogOpen: (isDialogOpen: boolean) => void;
};
