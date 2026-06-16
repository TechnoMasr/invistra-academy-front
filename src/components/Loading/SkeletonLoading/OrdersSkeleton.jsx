import { Skeleton } from "@/components/ui/skeleton";

const OrdersSkeleton = () => {
  // مصفوفة وهمية لتكرار كروت الطلبات أثناء التحميل
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {skeletonItems.map((_, index) => (
        <div key={index} className="border rounded-lg p-3 flex flex-col gap-2">
          {/* كود الطلب */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>

          {/* حالة الدفع */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>

          {/* حالة الطلب */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>

          {/* التاريخ وأيقونة الكالندر */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>

          {/* جزء بوابة الدفع (فودافون كاش - الصورة والنصوص) */}
          <div className="flex items-center gap-2 py-1">
            {/* اللوجو المربع الخاص بطريقة الدفع */}
            <Skeleton className="w-12 h-12 rounded-md shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          </div>

          {/* السطر السفلي (السعر والزر) */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 mt-auto">
            {/* السعر */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-10 rounded-md" />
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>

            {/* زر عرض تفاصيل الطلب */}
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
