import TButton from "@/components/custom/TButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useEffect, useRef, useState, type ChangeEvent } from "react";

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
    .email("Invalid email address!"),
});

const AccountPage = () => {
  const { userData } = useAuthUser();
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: userData?.fullname,
      username: userData?.username,
      email: userData?.email,
    },
  });

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    photoInputRef.current?.click();
  };

  const getAvatarImageSource = () => {
    if (photoPath) return photoPath;
    return userData?.photoURL;
  };

  const handleAvatarPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous URL if exists
    if (photoPath) URL.revokeObjectURL(photoPath);

    // Create a temporary blob URL for preview
    const url = URL.createObjectURL(file);
    console.log(url);
    setPhotoPath(url);
  };

  useEffect(() => {
    return () => {
      if (photoPath) URL.revokeObjectURL(photoPath);
    };
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async () => {};
  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 text-sm">
            <div className="*:data-[slot=avatar]:ring-background flex items-end -space-x-4 *:data-[slot=avatar]:ring-2">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={getAvatarImageSource() || userAvatar}
                  alt="@shadcn"
                />
                <AvatarFallback />
              </Avatar>
              <Avatar className="bg-gray-100 cursor-pointer flex justify-center items-center">
                <TButton variant="ghost" onClick={handleAvatarClick}>
                  <IconPencil stroke={2} />
                </TButton>
              </Avatar>
            </div>
            <input
              ref={photoInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleAvatarPhotoChange}
            />
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
