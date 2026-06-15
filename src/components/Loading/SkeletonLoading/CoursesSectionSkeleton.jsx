import { Skeleton } from "@/components/ui/skeleton";
import CourseCardSkeleton from "./CourseCardSkeleton"; // تأكد من المسار الصحيح

const CoursesSectionSkeleton = ({ isOnlyCoursesLoading = false }) => {
  return (
    <section className="sectionPadding relative">
      {/* خلفية الشبكة المنقطة للمحافظة على نفس شكل القسم الأصلي */}
      <div className="absolute inset-0 rounded-3xl opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[86px_86px] z-0"></div>

      <div className="container relative z-10">
        
        {/* نقوم بإخفاء سكلتون العنوان والتصنيفات إذا كان التحميل فقط للكورسات عند التنقل بين الأقسام */}
        {!isOnlyCoursesLoading && (
          <>
            {/* سكلتون العنوان والوصف الرئيسي */}
            <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
              <Skeleton className="h-9 w-[200px] md:w-[300px] rounded-md" />
              <Skeleton className="h-4 w-[250px] md:w-[380px] rounded-md" />
            </div>

            {/* سكلتون أزرار التصنيفات (Categories) */}
            <ul className="flex justify-center flex-wrap gap-2 mb-8">
              <Skeleton className="h-10 w-16 rounded-full" /> {/* زر الكل */}
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </ul>
          </>
        )}

        {/* شبكة كروت الكورسات التخيلية (3 كروت) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>

        {/* سكلتون زر "المزيد من الكورسات" بالأسفل */}
        {!isOnlyCoursesLoading && (
          <div className="flex justify-center mt-6">
            <Skeleton className="h-10 w-[160px] rounded-full" />
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSectionSkeleton;