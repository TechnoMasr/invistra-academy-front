import { Skeleton } from "@/components/ui/skeleton";

const KnowMoreSkeleton = () => {
  return (
    <section className="sectionPadding bg-primary relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80 animate-pulse" />

      <div className="w-full max-w-3xl p-4 mx-auto relative z-10 flex flex-col items-center text-center gap-6">
        {/* Title Skeleton */}
        <Skeleton className="h-10 w-3/4 md:w-1/2 rounded-md" />

        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full md:w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full md:w-3/4 rounded-md" />
        <Skeleton className="h-4 w-2/3 md:w-1/2 rounded-md" />

        {/* Button Skeleton */}
        <Skeleton className="h-12 w-36 rounded-full mt-4" />
      </div>
    </section>
  );
};

export default KnowMoreSkeleton;
