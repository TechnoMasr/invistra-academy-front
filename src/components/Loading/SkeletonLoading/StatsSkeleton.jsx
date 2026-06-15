import { Skeleton } from "@/components/ui/skeleton";

const StatsSkeleton = () => {
  return (
    <section className="sectionPadding">
      <div className="container">
        
        {/* محاكاة الـ SectionTitle (العنوان والوصف الفرعي للقسم) */}
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
          <Skeleton className="h-9 w-[250px] md:w-[350px] rounded-md" />
          <Skeleton className="h-4 w-[180px] md:w-[240px] rounded-md" />
        </div>

        {/* شبكة كروت الإحصائيات (4 كروت بنفس تقسيمات الشاشات) */}
        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li
              key={index}
              className="flex flex-col items-center gap-3 text-center border border-muted rounded-lg p-6 bg-card"
            >
              {/* سكلتون الأيقونة الدائرية */}
              <Skeleton className="w-16 h-16 rounded-full" />

              {/* سكلتون الرقم الكبير (العدد) */}
              <Skeleton className="h-12 w-[80px] rounded-md mt-2" />

              {/* سكلتون عنوان الكرت */}
              <Skeleton className="h-6 w-[120px] rounded-md" />

              {/* سكلتون الوصف الخاص بالكرت (سطرين) */}
              <div className="w-full flex flex-col items-center gap-1.5 mt-1">
                <Skeleton className="h-3.5 w-[90%] rounded-sm" />
                <Skeleton className="h-3.5 w-[70%] rounded-sm" />
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default StatsSkeleton;