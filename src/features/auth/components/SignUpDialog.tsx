import React, { useEffect } from "react";

import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";

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
import { toast } from "sonner";

import TButton from "@/components/custom/TButton";
import GoogleLogo from "@/assets/icons/google.svg?react";
import type {
  SignUpDialogProps,
  SignUpInputs,
} from "@/features/auth/authTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

const formSchema = z
  .object({
    username: z.string().min(1, {
      message: "Username is required!",
    }),
    email: z
      .string()
      .min(1, {
        message: "Email is required!",
      })
      .regex(/[A-Z]/, "Invalid email address!"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters!",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm your password!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

const SignUpDialog = ({
  isSignUpDialogOpen,
  onSignUpDialogOpenChange,
  onLogInDialogOpenChange,
}: SignUpDialogProps) => {
  const {
    emailSignUp,
    googleSignUp,
    authLoading: { emailAuthLoading, googleAuthLoading },
  } = useAuth();
  const navigate = useNavigate();

  /*   const {
    emailSignUp,
    googleSignUp,
    authLoading: { emailAuthLoading, googleAuthLoading },
  } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpInputs>();

  const switchToLoginDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    onSignUpDialogOpenChange(false);
    onLogInDialogOpenChange(true);
  };

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await googleSignUp();
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const onSubmit: SubmitHandler<SignUpInputs> = async ({
    email,
    password,
    username,
  }) => {
    const result = await emailSignUp(email, password, username);
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const password = watch("password"); */

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Then add debounce to the watch function
  useEffect(() => {
    const debounced = debounce(() => form.trigger("confirmPassword"), 500);
    const subscription = form.watch(debounced);
    return () => subscription.unsubscribe();
  }, [form]);

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await googleSignUp();
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  // 2. Define a submit handler.
  const onSubmit: SubmitHandler<SignUpInputs> = async ({
    email,
    password,
    username,
  }) => {
    const result = await emailSignUp(email, password, username);
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onSignUpDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const switchToLoginDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    onSignUpDialogOpenChange(false);
    onLogInDialogOpenChange(true);
  };

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <TButton
                      onClick={handleGoogleSignUp}
                      disabled={googleAuthLoading}
                    >
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
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-1">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-1">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-1">
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <TButton
                      type="submit"
                      className="mt-2"
                      disabled={emailAuthLoading}
                    >
                      Sign up
                    </TButton>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <TButton
                      variant="link"
                      onClick={switchToLoginDialogHandler}
                    >
                      Log in
                    </TButton>
                  </div>
                </div>
              </form>
            </Form>

            {/* <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <TButton
                    onClick={handleGoogleSignUp}
                    disabled={googleAuthLoading}
                  >
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
                        required: "Username is required!",
                      })}
                    />
                    {errors.username && (
                      <p className="text-xs font-medium text-destructive">
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
                        required: "Email is required!",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address!",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-xs font-medium text-destructive">
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
                        required: "Password is required!",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters!",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="text-xs font-medium text-destructive">
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
                          message: "Password must be at least 8 characters!",
                        },
                        validate: (value) =>
                          value === password || "Password do not match!",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <TButton
                    type="submit"
                    className="mt-2"
                    disabled={emailAuthLoading}
                  >
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
            </form> */}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
