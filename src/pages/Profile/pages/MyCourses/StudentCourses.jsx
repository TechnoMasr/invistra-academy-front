import { useState } from "react";
import OrdersDetailsCard from "@/components/cards/OrdersDetailsCard";
import ProfileTitle from "@/components/common/ProfileTitle";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";
import { getMyCourses } from "@/api/myCoursesServices";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination"; // استيراد الباجنيشن

const StudentCourses = () => {
  const { t } = useTranslation();

  // إدارة الصفحة الحالية محلياً داخل المكون
  const [page, setPage] = useState(1);

  // جلب البيانات بناءً على رقم الصفحة الحالية
  const { data: myCourses, isLoading } = useQuery({
    // ربط الـ queryKey برقم الصفحة لعمل refetch تلقائي عند تغيرها
    queryKey: ["myCourses", page],
    queryFn: () => getMyCourses({ page }),
  });

  // التحقق من خلو البيانات بناءً على الهيكل الجديد المرتجع (items)
  const isEmpty =
    !isLoading && (!myCourses?.items || myCourses?.items?.length === 0);

  // استخراج إجمالي عدد الصفحات ديناميكياً من الـ meta الخاصة بالسيرفر
  const totalPages = myCourses?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title="كورساتي" />

      {isLoading ? (
        <MyCoursesSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("myCourses.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses?.items?.map((item) => (
              <OrdersDetailsCard key={item.id} item={item} />
            ))}
          </div>

          {/* إضافة كومبوننت الترقيم في الأسفل */}
          <div className="flex justify-center pt-4">
            <MainPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentCourses;
