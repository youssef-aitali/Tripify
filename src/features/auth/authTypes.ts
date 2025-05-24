import { type User } from "firebase/auth";

export type AuthResult =
  | { user: User; firebaseError?: never }
  | { user?: never; firebaseError: { code: string } };
