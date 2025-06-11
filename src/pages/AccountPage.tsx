import TButton from "@/components/custom/TButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IconPencil } from "@tabler/icons-react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import userAvatar from "@/assets/icons/user.svg?url";

const formSchema = z.object({
  fullname: z.string(),
  username: z.string().min(1, {
    message: "Username is required!",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required!",
    })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address!"),
});

const AccountPage = () => {
  const { currentUser, isCurrentUserLoading } = useAuthUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: currentUser?.fullname,
      username: currentUser?.username,
      email: currentUser?.email,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async () => {};

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 text-sm">
            <div className="*:data-[slot=avatar]:ring-background flex items-end -space-x-4 *:data-[slot=avatar]:ring-2">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={currentUser?.photoURL || userAvatar}
                  alt="@shadcn"
                />
              </Avatar>
              <Avatar className="bg-gray-100 cursor-pointer flex justify-center items-center">
                <TButton variant="ghost">
                  <IconPencil stroke={2} />
                </TButton>
              </Avatar>
            </div>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g John Smith"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g gladnomad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex justifiy-center gap-2">
              <TButton type="submit" className="w-48 mt-4">
                Save
              </TButton>
              <TButton variant="ghost" className="w-48 mt-4">
                Cancel
              </TButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountPage;
