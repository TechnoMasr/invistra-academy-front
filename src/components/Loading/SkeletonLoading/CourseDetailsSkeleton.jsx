import { Skeleton } from "@/components/ui/skeleton";

// 1. سكلتون تفاصيل الكورس العلوية
const CourseDetailsHeaderSkeleton = () => {
  return (
    <section className="container sectionPadding grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16">
      {/* النصوص والأزرار (يسار في الشاشات الكبيرة) */}
      <div className="order-2 lg:order-1 space-y-5 content-center">
        {/* اسم الكورس - سطرين */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-[85%] rounded-md" />
          <Skeleton className="h-9 w-[50%] rounded-md" />
        </div>

        {/* وصف الكورس (Rich Content) - 3 أسطر */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-[95%] rounded-sm" />
          <Skeleton className="h-4 w-[70%] rounded-sm" />
        </div>

        {/* المحاضر (الصورة والاسم) */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-5 w-[120px] rounded-md" />
        </div>

        {/* القائمة الفرعية (المدة، عدد المحاضرات، القسم) */}
        <ul className="flex flex-wrap items-center gap-6 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-center gap-2">
              {/* مكان الأيقونة الكبيرة */}
              <Skeleton className="w-10 h-10 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-[60px] rounded-sm" />
                <Skeleton className="h-3.5 w-[40px] rounded-sm" />
              </div>
            </li>
          ))}
        </ul>

        {/* السعر */}
        <div className="flex items-center gap-3 pt-3">
          <Skeleton className="h-6 w-[60px] rounded-md" />
          <Skeleton className="h-14 w-[150px] rounded-md" />
        </div>

        {/* أزرار التحكم السفلى (أضف للسلة، اشتري الآن) */}
        <div className="flex items-center gap-2 pt-4">
          <Skeleton className="h-11 flex-1 rounded-full" />
          <Skeleton className="h-11 flex-1 rounded-full" />
        </div>
      </div>

      {/* صورة الكورس / الفيديو (يمين في الشاشات الكبيرة) */}
      <div className="order-1 lg:order-2">
        <Skeleton className="w-full aspect-6/4 rounded-xl" />
      </div>
    </section>
  );
};

// 2. سكلتون قسم "ماذا ستتعلم"
const CourseWhatLearnSkeleton = () => {
  return (
    <section className="container sectionPadding">
      {/* عنوان القسم */}
      <Skeleton className="h-8 w-[250px] md:w-[320px] rounded-md mb-6" />

      {/* شبكة العناصر المتوقعة (4 كروت تخيلية) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2.5 border border-muted rounded-lg p-3"
          >
            {/* عنوان العنصر الصغير */}
            <Skeleton className="h-5 w-[40%] rounded-md" />
            {/* وصف العنصر */}
            <Skeleton className="h-4 w-[90%] rounded-sm" />
          </div>
        ))}
      </div>
    </section>
  );
};

// 3. المكون المجمع الرئيسي للصفحة بالكامل
const CourseDetailsSkeleton = () => {
  return (
    <main>
      <CourseDetailsHeaderSkeleton />
      <CourseWhatLearnSkeleton />
    </main>
  );
};

export default CourseDetailsSkeleton;