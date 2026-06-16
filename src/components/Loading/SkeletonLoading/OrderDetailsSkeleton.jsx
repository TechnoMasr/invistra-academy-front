import { Skeleton } from "@/components/ui/skeleton";

const OrderDetailsSkeleton = () => {
  // مصفوفة وهمية لتمثيل عناصر الطلب أثناء التحميل
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة (تفاصيل الطلب) */}
      <Skeleton className="h-8 w-40 rounded-md" />

      {/* شبكة الكروت المتطابقة مع التصميم الأصلي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white flex items-start gap-3 p-3"
          >
            {/* صورة الكورس الجانبية */}
            <Skeleton className="w-1/3 aspect-square rounded-md shrink-0" />

            {/* تفاصيل الكارد المحاذية للصورة */}
            <div className="flex-1 flex flex-col gap-2">
              {/* عنوان الكورس */}
              <Skeleton className="h-6 w-11/12 rounded-md" />

              {/* وصف الكورس */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              {/* المحاضرات والقسم */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>

              {/* حالة الكورس */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>

              {/* المدرس (الصورة والاسم) */}
              <div className="flex items-center gap-2 py-1">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>

              {/* السعر وزر الانتقال */}
              <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-1">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
