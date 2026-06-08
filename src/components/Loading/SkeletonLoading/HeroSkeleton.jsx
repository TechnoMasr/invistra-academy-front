import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
  return (
    <section className="w-full h-screen relative">
      {/* Video Placeholder */}
      <Skeleton className="absolute top-0 left-0 w-full h-full" />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/20">
        <div className="container max-w-2xl h-full flex flex-col justify-center items-center text-center gap-6">
          {/* Title */}
          <Skeleton className="h-14 w-3/4" />

          {/* Description */}
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-6 w-2/3" />

          {/* Button */}
          <Skeleton className="h-12 w-40 mt-2 rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
