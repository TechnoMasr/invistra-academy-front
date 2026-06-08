import { Skeleton } from "@/components/ui/skeleton";

const CartPageSkeleton = () => {
  return (
    <section className="container pagePadding">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
        {/* Cart Items */}
        <div className="space-y-4 flex-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-3 border rounded-lg flex items-start gap-4"
            >
              {/* image */}
              <Skeleton className="w-28 md:w-48 aspect-square rounded-lg" />

              <div className="flex-1 space-y-3">
                {/* title + actions */}
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-5 w-40" />

                  <div className="flex gap-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-7 h-7 rounded-full" />
                  </div>
                </div>

                {/* weight */}
                <Skeleton className="h-4 w-20" />

                {/* price */}
                <Skeleton className="h-5 w-24" />

                {/* quantity + total */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="md:w-75 lg:w-96 p-3 space-y-4 border rounded-lg h-max bg-primary-foreground sticky top-20">
          <Skeleton className="h-6 w-40" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <Skeleton className="h-8 w-32" />

          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default CartPageSkeleton;
