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

export type AuthResult =
  | { user: User; error?: never }
  | { user?: never; error: { code: string } };

export type AuthErrorResponse = {
  error: {
    code: string;
    message?: string;
  };
};

export type OutletProps = {
  isLogInDialogOpen: boolean;
  setIsLogInDialogOpen: (isDialogOpen: boolean) => void;
};
