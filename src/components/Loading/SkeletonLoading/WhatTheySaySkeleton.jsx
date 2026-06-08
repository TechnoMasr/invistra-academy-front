// WhatTheySaySkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

const WhatTheySaySkeleton = () => {
  return (
    <section className="sectionPadding">
      <div className="container">
        {/* Section Title */}
        <Skeleton className="h-8 w-56 mb-4" />

        {/* Description */}
        <Skeleton className="h-4 w-3/4 mb-6" />

        {/* Slider Items */}
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-[250px] flex-shrink-0 space-y-3">
              <Skeleton className="w-full h-40 rounded-lg" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatTheySaySkeleton;
