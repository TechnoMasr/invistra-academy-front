import { Skeleton } from "@/components/ui/skeleton";

const OrderDetailsSkeleton = () => {
  // مصفوفة وهمية لتمثيل عناصر الطلب أثناء التحميل
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة (تفاصيل الطلب) */}
      <Skeleton className="h-8 w-40 rounded-md" />

      {/* شبكة الكروت المتطابقة مع التصميم الأصلي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white flex flex-col xl:flex-row items-start gap-4 p-4"
          >
            {/* صورة الكورس الجانبية */}
            <Skeleton className="w-full aspect-5/3 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 xl:aspect-square shrink-0 rounded-md" />

            {/* التفاصيل */}
            <div className="flex-1 flex flex-col gap-2 w-full">
              {/* عنوان الكورس */}
              <Skeleton className="h-6 w-3/4 rounded-md" />

              {/* وصف الكورس */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              {/* عدد المحاضرات والتصنيف */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-md" />
              </div>

              {/* حالة الكورس */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>

              {/* المدرس (الصورة والاسم) */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>

              {/* السعر والخصم */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>

              {/* زر عرض المحاضرات وشريط التقدم (حالة مكتمل) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-auto w-full">
                {/* زر عرض المحاضرات */}
                <Skeleton className="h-9 w-full rounded-full" />

                {/* شريط التقدم */}
                <div className="flex flex-col gap-1.5 my-1">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-32 rounded-md" />
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                  </div>
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
