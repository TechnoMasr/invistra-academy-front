import { Skeleton } from "@/components/ui/skeleton";

const OurStorySkeleton = () => {
  return (
    <section className="container sectionPadding">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Content */}
        <div className="space-y-6 content-center">
          {/* Section Label */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-0.5 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-2/3" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          {/* Statistics */}
          <ul className="flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 not-last:border-e border-muted not-last:pe-8"
              >
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </li>
            ))}
          </ul>

          {/* Button */}
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* Right Image */}
        <div className="hidden md:block w-full aspect-4/5 min-h-100 relative">
          <Skeleton className="w-full h-full rounded-lg" />

          {/* Established Year Badge */}
          <Skeleton className="absolute -bottom-4 -inset-e-2 h-12 w-24 rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export default OurStorySkeleton;
