import { Skeleton } from "../ui/skeleton";

const LoadingSkeleton = () => (
  <div className="flex justify-center">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-50" />
  </div>
);

export default LoadingSkeleton;
