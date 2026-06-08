import { Skeleton } from "@/components/ui/skeleton";

const OurServiceSkeleton = () => {
  return (
    <section className="sectionPadding">
      <div className="container">
        {/* Section Title */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-56" />
        </div>

        {/* Slider */}
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[250px] flex-shrink-0">
              <Skeleton className="w-full h-56 rounded-lg mb-2" />
              <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServiceSkeleton;
