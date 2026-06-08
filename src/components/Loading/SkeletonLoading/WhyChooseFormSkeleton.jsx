// WhyChooseFormSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

const WhyChooseFormSkeleton = () => {
  return (
    <section className="sectionPadding relative bg-center bg-cover">
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      <div className="container relative z-10">
        {/* Title */}
        <div className="text-center mb-12 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>

        {/* Items Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="flex flex-col items-center text-center space-y-2"
            >
              {/* Icon */}
              <Skeleton className="w-14 h-14 rounded-xl" />

              {/* Item Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Item Description */}
              <Skeleton className="h-3 w-5/6" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseFormSkeleton;
