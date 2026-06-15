import { Skeleton } from "@/components/ui/skeleton";

const TeacherDetailsSkeleton = () => {
  return (
    <main className="space-y-6">
      {/* 1. الجزء العلوي */}
      <section>
        {/* خلفية الغلاف (Hero Banner) بنفس الطول h-48 */}
        <div className="relative h-48 w-full bg-slate-100 flex items-end">
          <div className="container relative">
            {/* سكلتون الاسم فوق الغلاف مع إزاحة جهة اليمين (ps-34 / ps-58) */}
            <div className="mb-4 ps-34 md:ps-58">
              <Skeleton className="h-8 w-[180px] md:w-[260px] bg-white/40" />
            </div>

            {/* سكلتون الصورة الشخصية الدائرية البارزة (absolute) */}
            <div className="absolute -bottom-16 md:-bottom-24 inset-s-4 w-32 md:w-54 aspect-square rounded-full border-4 border-white overflow-hidden bg-white z-10">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          </div>
        </div>

        {/* تفاصيل المحاضر السفلية (الوصف والتخصص) */}
        <div className="container">
          <div className="mt-4 ps-34 md:ps-58">
            {/* المسمى الوظيفي والتخصص */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4 pt-1">
              <Skeleton className="h-5 w-[120px] rounded-md" />
              <Skeleton className="h-5 w-[100px] rounded-md hidden md:block" />
            </div>

            {/* سكلتون الـ Bio (سطرين) */}
            <div className="space-y-2 max-w-3xl">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-[75%] rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. شبكة الكورسات والترقيم */}
      <section className="container pagePadding space-y-8">
        {/* شبكة تطابق كلاسات التجاوب لديك تماماً */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden bg-white flex flex-col"
            >
              <Skeleton className="w-full aspect-5/3 rounded-none" />
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-7 w-[85%] rounded-md" />
                  <Skeleton className="h-7 w-[55%] rounded-md" />
                </div>
                <div className="flex flex-col gap-1.5 my-1">
                  <Skeleton className="h-4 w-full rounded-sm" />
                  <Skeleton className="h-4 w-[80%] rounded-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-[90px] rounded-md" />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                  <Skeleton className="h-7 w-[100px] rounded-full" />
                  <Skeleton className="h-7 w-[65px] rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* سكلتون المحاكاة لعناصر الترقيم (Pagination) بالأسفل */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <Skeleton className="h-9 w-9 rounded-md" /> {/* السهم الأيمن */}
          <Skeleton className="h-9 w-9 rounded-md" /> {/* رقم 1 */}
          <Skeleton className="h-9 w-9 rounded-md" /> {/* رقم 2 */}
          <Skeleton className="h-9 w-9 rounded-md" /> {/* السهم الأيسر */}
        </div>
      </section>
    </main>
  );
};

export default TeacherDetailsSkeleton;
