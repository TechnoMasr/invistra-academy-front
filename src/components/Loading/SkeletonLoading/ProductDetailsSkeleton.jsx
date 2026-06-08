// ProductDetailsSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <section className="container pagePadding grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Images Skeleton */}
      <div className="space-y-4 xl:col-span-1">
        {/* Main Image */}
        <Skeleton className="w-full aspect-square rounded-2xl" />

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="w-full aspect-square rounded-xl" />
          ))}
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="space-y-6">
        {/* Title */}
        <Skeleton className="h-8 w-2/3 rounded-md" />

        {/* Weights / Sizes */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        {/* Quantity Selector */}
        <Skeleton className="h-8 w-32 rounded-md" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>

        {/* Accordion */}
        <div className="space-y-2 border-y py-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSkeleton;
