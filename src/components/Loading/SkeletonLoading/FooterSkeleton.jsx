// FooterSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

const FooterSkeleton = () => {
  return (
    <footer className="sectionPadding relative bg-center bg-cover">
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/90" />

      <div className="container relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        {/* Logo & Text */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-5 w-24 mb-2" />
          <ul className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <Skeleton className="h-3 w-16 mx-auto" />
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-5 w-28 mb-2" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSkeleton;
