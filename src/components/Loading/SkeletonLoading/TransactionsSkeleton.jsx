import { Skeleton } from "@/components/ui/skeleton";

const TransactionsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* عنوان الصفحة الهيكلي */}
      <Skeleton className="h-8 w-48 rounded-lg" />

      {/* قسم الكروت الإحصائية العلوية الهيكلية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl p-5 flex items-center gap-3 bg-gray-50/50"
          >
            {/* الدائرة الهيكلية مكان الأيقونة */}
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />

            {/* النصوص الهيكلية داخل الكارت */}
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-6 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* عنوان قسم قائمة التحويلات */}
      <div className="pt-4">
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>

      {/* قائمة التحويلات الهيكلية */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 shadow-sm"
          >
            {/* عامود 1: قيمة التحويل */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>

            {/* عامود 2: رقم الحساب */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>

            {/* عامود 3: طريقة التحويل */}
            <div className="flex flex-col justify-between space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>

            {/* عامود 4: التاريخ والوقت */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
          </div>
        ))}

        {/* أزرار الـ Pagination الهيكلية */}
        <div className="flex justify-center pt-4">
          <Skeleton className="h-10 w-60 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TransactionsSkeleton;
