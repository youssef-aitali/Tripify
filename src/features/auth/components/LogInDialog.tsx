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

import TButton from "@/components/custom/TButton";
import type { LogInDialogProps } from "@/features/authTypes";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTE_PATHS } from "@/routes/routePaths";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required!",
    })
    .email("Invalid email address!"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters!",
  }),
});

const LogInDialog = ({
  isLogInDialogOpen,
  onSignUpDialogOpenChange,
  onLogInDialogOpenChange,
  onSendResetPasswordDialogOpenChange,
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

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await googleSignIn();
    if (result.success) {
      onLogInDialogOpenChange(false);
      navigate(ROUTE_PATHS.DASHBOARD);
    } else {
      toast.error(result.errorMessage);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async ({
    email,
    password,
  }) => {
    const result = await emailLogIn(email, password);
    if (result.success) {
      onLogInDialogOpenChange(false);
      navigate(ROUTE_PATHS.DASHBOARD);
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

  const HandleSwitchToSendResetPasswordDialog = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    form.reset();
    onLogInDialogOpenChange(false);
    onSendResetPasswordDialogOpenChange(true);
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
              Log in to access your save trips
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Card className="border-none shadow-none py-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Log in to Tripify</CardTitle>
            <CardDescription>Log in with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <TButton
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={googleAuthLoading}
                    >
                      <IconBrandGoogleFilled stroke={2} />
                      Log In with Google
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
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <TButton
                              variant="link"
                              className="ml-auto"
                              onClick={HandleSwitchToSendResetPasswordDialog}
                            >
                              Forgot your password?
                            </TButton>
                          </div>
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
                      Log In
                    </TButton>
                  </div>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <TButton
                      variant="link"
                      className="font-semibold"
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
