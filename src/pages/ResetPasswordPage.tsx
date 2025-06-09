import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutletContext, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

import TButton from "@/components/custom/TButton";
import { checkResetLinkValidity } from "@/features/auth/services/authService";
import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";

const formSchema = z
  .object({
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

const ResetPasswordPage = () => {
  const [isValidLink, setIsValidLink] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasChecked = useRef(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const {
    confirmNewPassword,
    authLoading: { setNewPasswordLoading },
  } = useAuth();

  const setIsLogInDialogOpen: (open: boolean) => void = useOutletContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkLinkValidity = async () => {
      if (!oobCode) {
        return;
      }

      try {
        const email = await checkResetLinkValidity(oobCode);
        setIsValidLink(!!email);
      } catch (error) {
        setIsValidLink(false);
      }

      setIsLoading(false);
    };

    checkLinkValidity();
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async ({
    password,
  }) => {
    if (oobCode) {
      const result = await confirmNewPassword(oobCode, password);
      if (result.success) {
        setIsSuccess(true);
      } else {
        toast.error(result.errorMessage);
        setIsSuccess(false);
      }
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (isSuccess) {
    return (
      <div className="px-[30%]">
        <p className="font-semibold text-2xl pb-5">
          Password Reset Successful!
        </p>
        <p className="text-sm text-green-600">
          You can now{" "}
          <TButton
            variant="link"
            className="font-semibold text-green-900"
            onClick={() => setIsLogInDialogOpen(true)}
          >
            Log In
          </TButton>{" "}
          in with your new password!
        </p>
      </div>
    );
  }

  return (
    <div className="px-[30%]">
      <p className="font-semibold text-2xl pb-5">Reset your password</p>
      {isValidLink ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4">
              <div className="grid gap-2 text-sm">
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={setNewPasswordLoading}
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={setNewPasswordLoading}
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
                  disabled={setNewPasswordLoading}
                >
                  {form.formState.isSubmitting && (
                    <Loader2Icon className="animate-spin" />
                  )}
                  Set new password
                </TButton>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <p className="text-sm text-destructive text-center">
          The password reset link you followed has expired or is invalid.
          Please, request another one!
        </p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
