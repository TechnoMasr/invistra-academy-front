import { Skeleton } from "@/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-0 flex flex-col gap-0">
      {/* سكلتون الصورة بنفس أبعاد aspect-5/3 */}
      <Skeleton className="w-full aspect-5/3 rounded-none" />

      {/* محتوى الكارت */}
      <div className="flex flex-col gap-4 p-4">
        {/* سكلتون اسم الكورس (سطرين) */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-[90%] rounded-md" />
          <Skeleton className="h-7 w-[60%] rounded-md" />
        </div>

        {/* سكلتون الوصف (سطرين خفاف) */}
        <div className="flex flex-col gap-1.5 my-1">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-[80%] rounded-sm" />
        </div>

        {/* سكلتون المحاضر (الصورة الدائرية والاسم) */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-5 w-[100px] rounded-md" />
        </div>

        {/* سكلتون العداد والسعر */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
          {/* شارة عدد المحاضرات */}
          <Skeleton className="h-7 w-[110px] rounded-full" />
          {/* السعر */}
          <Skeleton className="h-7 w-[70px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;