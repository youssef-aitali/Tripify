import { type User } from "firebase/auth";

export type SignUpInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpDialogProps = {
  isSignUpDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
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
