import { type User } from "firebase/auth";

export type AuthResult =
  | { user: User; error?: never }
  | { user?: never; error: { code: string } };

export type AuthErrorResponse = {
  error: {
    code: string;
    message?: string;
  };
};
