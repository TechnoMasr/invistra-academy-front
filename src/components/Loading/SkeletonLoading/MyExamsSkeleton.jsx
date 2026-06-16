import { Skeleton } from "@/components/ui/skeleton";

const MyExamsSkeleton = () => {
  // مصفوفة وهمية لتكرار كروت الاختبارات أثناء التحميل
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {skeletonItems.map((_, index) => (
        <div key={index} className="border rounded-lg p-4 flex flex-col gap-2">
          {/* عنوان الاختبار */}
          <Skeleton className="h-6 w-3/4 rounded-md" />

          {/* اسم المادة / الكورس الفرعي */}
          <Skeleton className="h-4 w-1/2 rounded-md opacity-70" />

          {/* القسم */}
          <Skeleton className="h-4 w-1/3 rounded-md mt-1" />

          {/* شارات (Badges) حالة الاختبار وعدد الأسئلة */}
          <div className="flex items-center gap-2 my-1">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* بيانات المدرس (الصورة الدائرية والاسم) */}
          <div className="flex items-center gap-2 py-1">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          {/* الخط الفاصل */}
          <hr className="my-2 opacity-50" />

          {/* السطر السفلي (درجة الاختبار وزر العرض) */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyExamsSkeleton;
