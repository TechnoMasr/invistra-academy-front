// ProductsSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

const ProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <div className="flex justify-between items-center gap-2">
            <Skeleton className="h-3 w-1/4 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full rounded-md mt-1" />
          <Skeleton className="h-8 w-full rounded-md mt-2" />
        </div>
      ))}
    </div>
  );
};

export default ProductsSkeleton;
