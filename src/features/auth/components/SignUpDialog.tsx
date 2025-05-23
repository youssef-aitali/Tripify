import React, { useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import GoogleLogo from "@/assets/icons/google.svg?react";
import TButton from "@/components/custom/TButton";

import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useForm, type SubmitHandler } from "react-hook-form";

type SignUpInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpDialogProps = {
  isSignUpDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
  onLogInDialogOpenChange: (open: boolean) => void;
};

/* const initialUserData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}; */

const SignUpDialog = ({
  isSignUpDialogOpen,
  onSignUpDialogOpenChange,
  onLogInDialogOpenChange,
}: SignUpDialogProps) => {
  //const [userData, setUserData] = useState(initialUserData);
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  /* const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await registerUser(
      userData.email,
      userData.password,
      userData.username
    );
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast(result.errorMessage);
    }
  }; */

  const switchToLoginDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    onSignUpDialogOpenChange(false);
    onLogInDialogOpenChange(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpInputs>();

  const onSubmit: SubmitHandler<SignUpInputs> = async ({
    email,
    password,
    username,
  }) => {
    const result = await registerUser(email, password, username);
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast(result.errorMessage);
    }
  };
  const password = watch("password");

  return (
    <Dialog open={isSignUpDialogOpen} onOpenChange={onSignUpDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px] [&_.absolute]:cursor-pointer">
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Sign up</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>Sign up to save your trips</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Card className="border-none shadow-none py-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign up to Tripify</CardTitle>
            <CardDescription>
              Sign up with your Google or Facebook account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* "handleSubmit" will validate your inputs before invoking
            "onSubmit" */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <TButton>
                    <GoogleLogo className="fill-white" />
                    Sign up with Google
                  </TButton>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="grid gap-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                    {errors.username && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="your@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password!",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        validate: (value) =>
                          value === password || "Password do not match",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <TButton type="submit" className="mt-2" disabled={loading}>
                    Sign up
                  </TButton>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <TButton variant="link" onClick={switchToLoginDialogHandler}>
                    Log in
                  </TButton>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
