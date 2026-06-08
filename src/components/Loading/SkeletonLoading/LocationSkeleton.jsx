import { Skeleton } from "@/components/ui/skeleton";

const LocationSkeleton = () => {
  return (
    <main>
      <div className="min-h-[calc(100vh-30px)] relative flex items-center justify-center">
        {/* background */}
        <Skeleton className="absolute inset-0 w-full h-full bg-primary/20" />

        <div className="relative z-10 w-full p-4 max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          {/* title */}
          <Skeleton className="h-3 w-32" />

          {/* logo */}
          <Skeleton className="h-16 w-32" />

          {/* description */}
          <div className="space-y-2 w-full flex flex-col items-center">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* button */}
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </main>
  );
};

export default LocationSkeleton;
