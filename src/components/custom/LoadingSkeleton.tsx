import { Skeleton } from "../ui/skeleton";

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-50" />
  </div>
);

export default LoadingSkeleton;
