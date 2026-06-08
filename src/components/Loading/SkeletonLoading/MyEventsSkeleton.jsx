import { Skeleton } from "@/components/ui/skeleton";

const MyEventsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-3 border rounded-lg items-start flex flex-col gap-2"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-2 w-full">
            <Skeleton className="h-5 w-40" />

            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-7 h-7 rounded-full" />
            </div>
          </div>

          {/* date badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>

          {/* people */}
          <Skeleton className="h-4 w-24" />

          {/* gender */}
          <Skeleton className="h-4 w-20" />

          {/* location */}
          <Skeleton className="h-4 w-40" />

          {/* button */}
          <Skeleton className="h-8 w-28 rounded-md mt-1" />
        </div>
      ))}
    </div>
  );
};

export default MyEventsSkeleton;
