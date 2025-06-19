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

import type { SignUpDialogProps } from "@/features/authTypes";
import GoogleLogo from "@/assets/icons/google.svg?react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTE_PATHS } from "@/routes/routePaths";
import { playConfettiAnimation } from "@/features/auth/utils/playConfettiAnimation";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "Email is required!",
      })
      .email("Invalid email address!"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters!",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm your password!",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await googleSignUp();
    if (result.success) {
      onSignUpDialogOpenChange(false);
      playConfettiAnimation();
      navigate(ROUTE_PATHS.DASHBOARD);
    } else {
      toast.error(result.errorMessage);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async ({
    email,
    password,
  }) => {
    const result = await emailSignUp(email, password);
    if (result.success) {
      onSignUpDialogOpenChange(false);
      playConfettiAnimation();
      navigate(ROUTE_PATHS.DASHBOARD);
    } else {
      toast.error(result.errorMessage);
    }
  };

  const switchToLoginDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    form.reset();
    onSignUpDialogOpenChange(false);
    onLogInDialogOpenChange(true);
  };

  const onDialogOpenChange = () => {
    onSignUpDialogOpenChange(!isSignUpDialogOpen);
    form.reset();
  };

  return (
    <Dialog open={isSignUpDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] [&_.absolute]:cursor-pointer"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
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
            <CardDescription>Sign up with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <TButton
                      className="w-full"
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
                  <div className="grid gap-4 text-sm">
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
                    <TButton
                      type="submit"
                      className="w-full mt-2"
                      disabled={emailAuthLoading}
                    >
                      Sign up
                    </TButton>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <TButton
                      variant="link"
                      className="font-semibold"
                      onClick={switchToLoginDialogHandler}
                      disabled={emailAuthLoading || googleAuthLoading}
                    >
                      Log in
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

export default SignUpDialog;
