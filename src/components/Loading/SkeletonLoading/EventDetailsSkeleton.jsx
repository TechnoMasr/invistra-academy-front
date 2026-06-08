import { Skeleton } from "@/components/ui/skeleton";
import { LuUsers } from "react-icons/lu";
import { FiExternalLink } from "react-icons/fi";

const EventDetailsSkeleton = () => {
  // نحدد عدد الكروت اللي عايزين نعرضها كسكليتون
  const cards = Array(4).fill(0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* خريطة ومعلومات المكان */}
        <div className="p-4 border rounded-2xl flex flex-col gap-2">
          <Skeleton className="w-full h-50 rounded-lg" />

          <div>
            <Skeleton className="w-24 h-4 mb-1" />
            <Skeleton className="w-40 h-6" />
          </div>

          <div>
            <Skeleton className="w-24 h-4 mb-1" />
            <Skeleton className="w-40 h-6" />
          </div>

          <Skeleton className="w-32 h-5 mt-2" />
        </div>

        {/* الكروت */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {cards.map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-2xl flex flex-col gap-2"
            >
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-6" />
            </div>
          ))}
        </div>
      </div>

      {/* عدد الحضور */}
      <div
        className="flex flex-col items-center gap-2 mt-4 max-w-lg mx-auto
          bg-primary text-white rounded-xl p-4"
      >
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-24 h-8 mt-1" />
        <Skeleton className="w-32 h-4 mt-1" />
      </div>
    </>
  );
};

export default EventDetailsSkeleton;
