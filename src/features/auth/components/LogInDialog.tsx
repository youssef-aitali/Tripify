import React from "react";

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
import TButton from "@/components/custom/TButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { LogInDialogProps, AuthInputs } from "@/features/auth/authTypes";
import GoogleLogo from "@/assets/icons/google.svg?react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required!",
    })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address!"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters!",
  }),
});

const LogInDialog = ({
  isLogInDialogOpen,
  onSignUpDialogOpenChange,
  onLogInDialogOpenChange,
}: LogInDialogProps) => {
  const {
    emailLogIn,
    googleSignIn,
    authLoading: { emailAuthLoading, googleAuthLoading },
  } = useAuth();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await googleSignIn();
    if (result.success) {
      // Redirect or show success message
      console.log("User created:", result.user);
      onLogInDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const onSubmit: SubmitHandler<AuthInputs> = async ({ email, password }) => {
    const result = await emailLogIn(email, password);
    if (result.success) {
      // Redirect or show success message
      console.log("User logged in:", result.user);
      onLogInDialogOpenChange(false);
      navigate("/dashboard");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const switchToSignUpDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    form.reset();
    onLogInDialogOpenChange(false);
    onSignUpDialogOpenChange(true);
  };

  const onDialogOpenChange = () => {
    onLogInDialogOpenChange(!isLogInDialogOpen);
    form.reset();
  };

  return (
    <Dialog open={isLogInDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] [&_.absolute]:cursor-pointer"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Log in</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Login to access your save trips
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Card className="border-none shadow-none py-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Log in to Tripify</CardTitle>
            <CardDescription>
              Log in with your Google or Facebook account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <TButton
                      onClick={handleGoogleSignUp}
                      disabled={googleAuthLoading}
                    >
                      <GoogleLogo className="fill-white" />
                      Log In with Google
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                              />
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
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                              <a
                                href="#"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                              >
                                Forgot your password?
                              </a>
                            </div>

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
                      Log In
                    </TButton>
                  </div>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <TButton
                      variant="link"
                      onClick={switchToSignUpDialogHandler}
                      disabled={emailAuthLoading || googleAuthLoading}
                    >
                      Sign Up
                    </TButton>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LogInDialog;
