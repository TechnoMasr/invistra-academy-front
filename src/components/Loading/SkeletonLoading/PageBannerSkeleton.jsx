import { Skeleton } from "@/components/ui/skeleton";

const PageBannerSkeleton = () => {
  return (
    <article className="w-full min-h-72 relative content-end">
      {/* background */}
      <Skeleton className="absolute inset-0 w-full h-full bg-primary/20" />

      {/* content */}
      <div className="relative z-10 container h-full pt-20 pb-10 flex flex-col items-start justify-end gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
    </article>
  );
};

export default PageBannerSkeleton;
