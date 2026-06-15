import { Skeleton } from "@/components/ui/skeleton";

const CartPageSkeleton = () => {
  return (
    // استخدام flex-col lg:flex-row gap-4 تماماً كالصفحة الأصلية
    <section className="flex flex-col lg:flex-row gap-4">
      {/* 1. سكلتون قائمة كروت السلة (يمين الشاشة أو مرصوصة فوق) */}
      <div className="flex-1 flex flex-col gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg bg-white flex items-start gap-4 p-4"
          >
            {/* سكلتون الصورة بنفس أبعاد الكارت الحقيقي w-1/3 aspect-6/4 */}
            <div className="w-1/3 aspect-6/4">
              <Skeleton className="w-full h-full rounded-md" />
            </div>

            {/* محتوى الكارت */}
            <div className="flex-1 flex flex-col gap-2.5">
              {/* اسم الكورس */}
              <Skeleton className="h-7 w-[80%] rounded-md" />

              {/* تفاصيل المحاضرات والقسم */}
              <div className="flex items-center gap-4 my-1">
                <Skeleton className="h-4 w-[90px] rounded-sm" />
                <Skeleton className="h-4 w-[70px] rounded-sm" />
              </div>

              {/* صورة واسم المحاضر */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-5 w-[100px] rounded-md" />
              </div>

              {/* السعر وزر الحذف */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <Skeleton className="h-8 w-[110px] rounded-md" /> {/* السعر */}
                <Skeleton className="h-8 w-[80px] rounded-full" />{" "}
                {/* زر حذف */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. سكلتون كارت ملخص الطلب (OrderSummaryCard) */}
      <div className="w-full lg:w-96 p-4 space-y-4 border rounded-lg h-max bg-primary/5 sticky top-30">
        {/* عنوان ملخص الطلب */}
        <Skeleton className="h-7 w-[120px] pb-2" />
        <div className="border-b" />

        {/* سطر العدد */}
        <div className="flex justify-between items-center py-1">
          <Skeleton className="h-5 w-[50px]" />
          <Skeleton className="h-5 w-[30px]" />
        </div>

        {/* سطر الإجمالي */}
        <div className="flex justify-between items-center py-1">
          <Skeleton className="h-5 w-[70px]" />
          <Skeleton className="h-9 w-[120px]" /> {/* سكلتون السعر الكبير */}
        </div>

        {/* أزرار التحكم (الدفع واستكمال الشراء) */}
        <div className="space-y-3 pt-2">
          <Skeleton className="h-10 w-full rounded-md" /> {/* زر الدفع */}
          <Skeleton className="h-10 w-full rounded-md" />{" "}
          {/* زر استكمال الشراء */}
        </div>
      </div>
    </section>
  );
};

export default CartPageSkeleton;
