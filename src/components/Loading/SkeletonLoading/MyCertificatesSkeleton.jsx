import { Skeleton } from "@/components/ui/skeleton";

const MyCertificatesSkeleton = () => {
  // بنعمل مصفوفة وهمية من 6 عناصر عشان نملا الشاشة وقت التحميل
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {skeletonItems.map((_, index) => (
        <div key={index} className="border rounded-lg p-4 flex flex-col gap-2">
          {/* الصورة الأساسية للشهادة بنفس الـ aspect ratio */}
          <Skeleton className="w-full aspect-5/3 rounded-md" />

          <div className="flex flex-col gap-2">
            {/* عنوان الشهادة (سطرين) */}
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />

            {/* القسم والمادة */}
            <Skeleton className="h-5 w-1/3 mt-1" />

            {/* بيانات المدرس (الصورة الدائرية والاسم) */}
            <div className="flex items-center gap-2 py-1">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* أزرار التحميل والمشاركة */}
            <Skeleton className="h-10 w-full rounded-md mt-1" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCertificatesSkeleton;
