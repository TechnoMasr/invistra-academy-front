import { Skeleton } from "@/components/ui/skeleton";

const FooterSkeleton = () => {
  return (
    // استخدام نفس لون الخلفية والـ Padding لمنع حدوث الـ Layout Shift
    <footer className="sectionPadding bg-[#111418]">
      <div className="container flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4">
        
        {/* العمود الأول: اللوجو والوصف وأيقونات السوشيال ميديا */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          {/* سكلتون اللوجو بنفس مقاسات اللوجو الحقيقي w-28 lg:w-40 */}
          <Skeleton className="w-28 lg:w-40 h-12 bg-white/10" />

          {/* سكلتون نص الوصف (سطرين) */}
          <div className="flex flex-col items-center lg:items-start gap-2 max-w-80 w-64 md:w-80">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-[70%] bg-white/10" />
          </div>

          {/* سكلتون روابط السوشيال ميديا (5 أيقونات تخيلية بجانب بعضها) */}
          <div className="flex items-center justify-center gap-4 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-6 h-6 rounded-md bg-white/10" />
            ))}
          </div>
        </div>

        {/* العمود الثاني: روابط التنقل (المحاضرين، الكورسات...) */}
        <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>

        {/* العمود الثالث: روابط السياسات واتصل بنا */}
        <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
          <Skeleton className="h-4 w-28 bg-white/10" />
          <Skeleton className="h-4 w-36 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
        </div>

      </div>
    </footer>
  );
};

export default FooterSkeleton;