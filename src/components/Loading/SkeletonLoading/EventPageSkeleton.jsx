import { Skeleton } from "@/components/ui/skeleton";

const EventPageSkeleton = () => {
  // عدد الخطوات كسكليتون
  const steps = Array(3).fill(0);

  return (
    <>
      {/* خطوات الفعالية */}
      <section>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {steps.map((_, index) => (
            <li
              key={index}
              className="space-y-2 bg-primary text-white p-4 px-8 rounded-lg shadow"
            >
              {/* عنوان الخطوة */}
              <Skeleton className="w-full h-6" />

              {/* الرقم والوصف */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 aspect-square rounded-lg" />
                <Skeleton className="flex-1 h-4" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* العنوان والوصف */}
      <div className="space-y-2 mb-6">
        <Skeleton className="w-48 h-8" /> {/* العنوان الكبير */}
        <Skeleton className="w-64 h-4" /> {/* الوصف الثاني */}
      </div>
    </>
  );
};

export default EventPageSkeleton;
