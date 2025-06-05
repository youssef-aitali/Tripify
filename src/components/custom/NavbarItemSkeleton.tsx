import { Skeleton } from "../ui/skeleton";

const NavbarItemSkeleton = () => (
  <div className="flex justify-center gap-4">
    <Skeleton className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
    <Skeleton className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
  </div>
);

export default NavbarItemSkeleton;
