import { Skeleton } from "../ui/skeleton";

const AccountLoadingSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export default AccountLoadingSkeleton;
