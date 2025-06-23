import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconAlertCircle,
  IconPencil,
  IconLoader,
  IconTrash,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { getUserProfile } from "@/features/auth/utils/authUtils";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

import {
  getPhotoUploadURL,
  toggleUserDeletionMark,
  updateUserData,
} from "@/features/settings/services/settingsService";
import type { AuthUser } from "@/features/authTypes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TButton from "@/components/custom/TButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import LoadingSkeleton from "@/components/custom/LoadingSkeleton";
import AccountLoadingSkeleton from "@/components/custom/AccountLoadingSkeleton";

const formSchema = z.object({
  fullname: z.string(),
  username: z.string().min(1, {
    message: "Username is required!",
  }),
  email: z.string(),
});

const AccountPage = () => {
  const { userData, currentUser, setUserData } = useAuthUser();
  const [selectedPreviewPhoto, setSeletectedPreviewPhoto] = useState<
    File | undefined
  >(undefined);
  const [previewPhotoPath, setPreviewPhotoPath] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
    },
  });

  const { isDirty, isSubmitting } = form.formState;

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    photoInputRef.current?.click();
  };

  const handleAvatarPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous URL if exists
    previewPhotoPath && URL.revokeObjectURL(previewPhotoPath);

    // Create a temporary blob URL for preview
    setPreviewPhotoPath(URL.createObjectURL(file));
    setSeletectedPreviewPhoto(file);
  };

  useEffect(() => {
    if (userData) {
      form.reset({
        fullname: userData.fullname,
        username: userData.username,
        email: userData.email,
      });
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      if (previewPhotoPath) URL.revokeObjectURL(previewPhotoPath);
    };
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async ({
    fullname,
    username,
    email,
  }) => {
    const updatedUserData = {
      fullname,
      username,
      email,
      ...(selectedPreviewPhoto && {
        photoURL: await getPhotoUploadURL(selectedPreviewPhoto),
      }),
    };

    await updateUserData(currentUser!, updatedUserData as AuthUser);

    //setUserData(await getUserProfile(currentUser!.uid));

    setSeletectedPreviewPhoto(undefined);
    form.reset({
      fullname,
      username,
      email,
    });
  };

  const cancelAccountUpdates = () => {
    setSeletectedPreviewPhoto(undefined);
    setPreviewPhotoPath(null);
    form.reset();
  };

  const handleAccountDeletion = async () => {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 10);

    currentUser &&
      (await toggleUserDeletionMark(currentUser.uid, deletionDate));
    //currentUser && (await markUserForDeletion(currentUser.uid, deletionDate));
    //setUserData(await getUserProfile(currentUser!.uid));
  };

  const handleCancelDeletion = async () => {
    currentUser && (await toggleUserDeletionMark(currentUser.uid, null));
    //currentUser && (await cancelUserDeletionMark(currentUser.uid));
    //setUserData(await getUserProfile(currentUser!.uid));
  };

  if (!userData)
    return (
      <div className="flex justify-center items-center">
        <AccountLoadingSkeleton />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 text-sm">
            <div className="*:data-[slot=avatar]:ring-background flex items-end -space-x-4 *:data-[slot=avatar]:ring-2">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={previewPhotoPath || userData?.photoURL || undefined}
                  alt="Avatar"
                />
                <AvatarFallback
                  className="bg-gray-400 text-4xl font-semibold text-white"
                  delayMs={1500}
                >
                  {userData?.username[0].toUpperCase()}
                </AvatarFallback>
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
                      disabled
                      {...field}
                    />
                  </FormControl>
                  {currentUser?.providerData[0].providerId === "google.com" && (
                    <FormDescription className="text-xs ml-auto">
                      Managed by Google
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justifiy-center gap-2 mt-4 mb-4">
              <TButton
                type="submit"
                className="w-1/2"
                disabled={(!isDirty && !selectedPreviewPhoto) || isSubmitting}
              >
                {isSubmitting && <IconLoader className="animate-spin" />}
                Save
              </TButton>
              {(isDirty || selectedPreviewPhoto) && !isSubmitting && (
                <TButton
                  variant="ghost"
                  className="w-1/2"
                  onClick={cancelAccountUpdates}
                >
                  Cancel
                </TButton>
              )}
            </div>
          </div>
        </form>
      </Form>
      <div className="border-t border-border" />
      {!userData?.pendingDeletion ? (
        <Dialog>
          <DialogTrigger asChild>
            <TButton variant="ghost" className="text-gray-600 w-full text-left">
              <IconTrash stroke={2} /> Delete account
            </TButton>
          </DialogTrigger>
          <DialogContent className="[&_.absolute]:cursor-pointer">
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and remove your data
                from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <TButton>Keep my account</TButton>
              </DialogClose>
              <DialogClose asChild>
                <TButton variant="ghost" onClick={handleAccountDeletion}>
                  Continue with account deletion
                </TButton>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Alert variant="destructive" className="border-red-200 bg-red-100">
          <IconAlertCircle stroke={3} />
          <AlertDescription className="flex-col gap-2">
            <p>
              Account scheduled to be deleted in 10 days. After that, it will be
              permanently removed and cannot be recovered. You can change your
              mind any time before{" "}
              <strong>
                {format(
                  userData?.pendingDeletion?.scheduledFor.toDate(),
                  "EEEE, MMMM d, yyyy h:mm a"
                )}
              </strong>
            </p>
            <TButton onClick={handleCancelDeletion}>Cancel deletion</TButton>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AccountPage;
