import { Skeleton } from "@/components/ui/skeleton";

const MyOrdersSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 border rounded-lg flex items-start gap-4">
          {/* image */}
          <Skeleton className="w-24 md:w-32 aspect-square rounded-lg" />

          <div className="flex-1 space-y-3">
            {/* title + actions */}
            <div className="flex justify-between gap-2">
              <Skeleton className="h-5 w-40" />
            </div>

            {/* weight */}
            <Skeleton className="h-4 w-20" />

            {/* price */}
            <Skeleton className="h-5 w-24" />

            {/* quantity + total */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersSkeleton;
