import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
  return (
    <section className="bg-white min-h-[calc(100vh-83px)] flex items-center sectionPadding relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-22 items-center justify-center">
          
          {/* محتوى النصوص والزر (شمال في الشاشات الكبيرة) */}
          <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start text-center lg:text-start gap-4 lg:gap-6 order-2 lg:order-1">
            {/* سكلتون العنوان - سطرين */}
            <div className="w-full flex flex-col items-center lg:items-start gap-2">
              <Skeleton className="h-10 w-[80%] md:w-[60%] rounded-md" />
              <Skeleton className="h-10 w-[50%] md:w-[40%] rounded-md" />
            </div>

            {/* سكلتون الوصف (النص الغني) - 3 أسطر */}
            <div className="w-full flex flex-col items-center lg:items-start gap-2 my-2">
              <Skeleton className="h-4 w-[95%] lg:w-[90%] rounded-md" />
              <Skeleton className="h-4 w-[90%] lg:w-[85%] rounded-md" />
              <Skeleton className="h-4 w-[70%] lg:w-[60%] rounded-md" />
            </div>

            {/* سكلتون الزر */}
            <Skeleton className="h-11 w-full md:w-45 rounded-full" />
          </div>

          {/* سكلتون الصورة (يمين في الشاشات الكبيرة) */}
          <div className="w-[70%] sm:w-[40%] lg:w-1/2 flex justify-center order-1 lg:order-2">
            <Skeleton className="w-full aspect-square max-h-150 rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;