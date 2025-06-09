import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IconPencil } from "@tabler/icons-react";

const AccountPage = () => {
  return (
    <>
      <div className="*:data-[slot=avatar]:ring-background flex items-end -space-x-4 *:data-[slot=avatar]:ring-2">
        <Avatar className="w-20 h-20">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
        <Avatar className="bg-gray-100 cursor-pointer flex justify-center">
          <IconPencil stroke={2}></IconPencil>
        </Avatar>
      </div>
    </>
  );
};

export default AccountPage;
