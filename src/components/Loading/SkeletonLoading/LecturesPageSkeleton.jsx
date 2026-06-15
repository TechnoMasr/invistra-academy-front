import { Skeleton } from "@/components/ui/skeleton";

// 1. سكلتون كارت المحاضرة المنفردة (LectureCard)
const LectureCardSkeleton = () => {
  return (
    // استخدام نفس كلاسات الكارت الحقيقي للتوزيع (flex justify-between gap-3 p-3)
    <div className="border rounded-lg flex justify-between items-center gap-3 p-3 bg-white">
      
      {/* اليمين: الدائرة وأيقونة التشغيل التخيلية + عنوان المحاضرة */}
      <div className="flex items-center gap-2 flex-1">
        {/* سكلتون الدائرة بنفس أبعاد الحقيقية w-8 h-8 */}
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        
        {/* سكلتون نص عنوان المحاضرة */}
        <Skeleton className="h-5 w-[40%] md:w-[250px] rounded-md" />
      </div>

      {/* اليسار: مدة المحاضرة */}
      <Skeleton className="h-5 w-[60px] rounded-md" />

    </div>
  );
};

// 2. المكون المجمع الرئيسي لصفحة المحاضرات بالكامل
const LecturesPageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* سكلتون عنوان الصفحة الرئيسي (ProfileTitle) */}
      <hgroup>
        <Skeleton className="h-9 lg:h-11 w-[180px] md:w-[240px] rounded-md" />
      </hgroup>

      {/* شبكة قائمة المحاضرات التخيلية (محاكاة لـ 5 محاضرات كمثال) */}
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <LectureCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LecturesPageSkeleton;