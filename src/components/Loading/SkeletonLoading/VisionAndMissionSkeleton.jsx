import { Skeleton } from "@/components/ui/skeleton";

const VisionAndMissionSkeleton = () => {
  return (
    <section className="sectionPadding">
      <div className="container">
        {/* Section Title */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-56" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mt-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border flex flex-col items-center text-center md:text-start md:items-start gap-3"
            >
              {/* icon */}
              <Skeleton className="w-14 h-14 rounded-full" />

              {/* title */}
              <Skeleton className="h-6 w-40" />

              {/* description */}
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionAndMissionSkeleton;
