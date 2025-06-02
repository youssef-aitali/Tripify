import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TButton from "@/components/custom/TButton";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthInputs } from "@/features/auth/authTypes";
import { Input } from "@/components/ui/input";
import { setNewPassword } from "@/features/auth/services/authService";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

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
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<Pick<AuthInputs, "password">> = async ({
    password,
  }) => {
    const oobCode = searchParams.get("oobCode");
    if (oobCode) {
      const result = await setNewPassword(oobCode, password);
      if (result.success) {
        toast.success("Password reset successful!");
      } else {
        toast.error(result.errorMessage);
      }
    }
  };

  return (
    <div className="px-[30%]">
      <p className="font-semibold text-2xl pb-5">Reset your password</p>
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
              <TButton type="submit" className="mt-2">
                Set new password
              </TButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
