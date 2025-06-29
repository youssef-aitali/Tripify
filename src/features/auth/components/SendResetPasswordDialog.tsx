import React from "react";

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

import type { SendResetPasswordDialogProps } from "@/features/authTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required!",
    })
    .email("Invalid email address!"),
});

const SendResetPasswordDialog = ({
  isSendResetPasswordDialogOpen,
  onSendResetPasswordDialogOpenChange,
  onLogInDialogOpenChange,
}: SendResetPasswordDialogProps) => {
  const {
    sendPasswordResetEmail,
    authLoading: { sendResetPasswordEmailLoading },
  } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async ({
    email,
  }) => {
    const result = await sendPasswordResetEmail(email);
    if (result.success) {
      toast.info("If this email exists, you'll receive a link shortly!");
    } else {
      toast.error(result.errorMessage);
    }
  };

  const switchToLoginDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    form.reset();
    onSendResetPasswordDialogOpenChange(false);
    onLogInDialogOpenChange(true);
  };

  const onDialogOpenChange = () => {
    onSendResetPasswordDialogOpenChange(!isSendResetPasswordDialogOpen);
    form.reset();
  };

  return (
    <Dialog
      open={isSendResetPasswordDialogOpen}
      onOpenChange={onDialogOpenChange}
    >
      <DialogContent
        className="sm:max-w-[425px] [&_.absolute]:cursor-pointer"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Reset password</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Get a secure link to create a new password
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Card className="border-none shadow-none py-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>
              Get a secure link to create a new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-4">
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
                    <TButton
                      type="submit"
                      className="mt-2"
                      disabled={sendResetPasswordEmailLoading}
                    >
                      Send Reset Link
                    </TButton>
                  </div>
                  <div className="text-center text-sm">
                    Remembered your password?{" "}
                    <TButton
                      variant="link"
                      className="font-semibold"
                      onClick={switchToLoginDialogHandler}
                    >
                      Log In
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

export default SendResetPasswordDialog;
