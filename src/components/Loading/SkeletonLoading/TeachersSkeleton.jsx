import { Skeleton } from "@/components/ui/skeleton";

const TeachersSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden bg-white flex flex-col p-2 gap-0"
        >
          <div className="flex-1 w-full flex flex-col items-center">
            {/* سكلتون صورة المحاضر بنفس الأبعاد aspect-5/4 */}
            <Skeleton className="w-full aspect-5/4 rounded-md mb-3" />

            {/* سكلتون اسم المحاضر */}
            <Skeleton className="h-6 w-[70%] rounded-md mb-2" />

            {/* سكلتون المسمى الوظيفي */}
            <Skeleton className="h-4 w-[50%] rounded-md mb-2" />
          </div>

          {/* سكلتون القسم التخصصي بالأسفل (border-t) */}
          <div className="border-t pt-3 pb-1 px-2 mt-2 w-full flex items-center justify-center gap-2">
            {/* مكان الأيقونة الصغيرة */}
            <Skeleton className="w-4 h-4 rounded-sm" />
            {/* اسم التخصص */}
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeachersSkeleton;
