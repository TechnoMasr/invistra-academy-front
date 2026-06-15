import { Skeleton } from "@/components/ui/skeleton";

const LectureDetailsSkeleton = () => {
  return (
    // نفس تقسيم الـ Grid الأصلي تماماً لضمان عدم حدوث Layout Shift
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      
      {/* الجزء الأيمن (الفيديو وتفاصيل النص) - يأخذ عمودين في الشاشات الكبيرة */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* سكلتون مشغل الفيديو بنفس أبعاد aspect-video */}
        <Skeleton className="w-full aspect-video rounded-2xl" />

        {/* سكلتون صندوق عنوان ووصف المحاضرة */}
        <div className="border rounded-2xl p-4 space-y-4">
          {/* العنوان (رقم المحاضرة + النص الداخلي) */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <Skeleton className="h-8 w-[60%] rounded-md" />
          </div>

          {/* وصف المحاضرة (3 أسطر تحاكي النص الطويل الكثيف المتوفر بكودك) */}
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-[95%] rounded-sm" />
            <Skeleton className="h-4 w-[80%] rounded-sm" />
          </div>
        </div>
      </div>

      {/* الجزء الأيسر الجانبي (ملفات ومرفقات المحاضرة) */}
      <div className="border rounded-2xl p-4 h-fit space-y-4">
        
        {/* رأس صندوق المرفقات */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-sm" />
            <Skeleton className="h-6 w-[140px] rounded-md" />
          </div>
          <Skeleton className="h-4 w-[90%] rounded-sm" />
        </div>

        {/* قائمة الملفات التخيلية (محاكاة لـ 4 ملفات بدلاً من 8 لتوفير أداء تحميل بصري متزن) */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              
              {/* تفاصيل الملف (أيقونة + نص) */}
              <div className="flex items-center gap-3">
                {/* مربع أيقونة الـ PDF */}
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                
                {/* العنوان والحجم */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[130px] rounded-md" />
                  <Skeleton className="h-3 w-[60px] rounded-sm" />
                </div>
              </div>

              {/* زر التحميل الجانبي */}
              <Skeleton className="h-6 w-[60px] rounded-full" />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default LectureDetailsSkeleton;