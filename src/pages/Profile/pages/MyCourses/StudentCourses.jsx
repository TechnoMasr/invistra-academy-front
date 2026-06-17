import { useState } from "react";
import OrdersDetailsCard from "@/components/cards/OrdersDetailsCard";
import ProfileTitle from "@/components/common/ProfileTitle";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";
import { getMyCoursesStudent } from "@/api/myCoursesServices";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";

const StudentCourses = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { data: myCourses, isLoading } = useQuery({
    queryKey: ["myCourses", page],
    queryFn: () => getMyCoursesStudent({ page }),
  });

  const isEmpty =
    !isLoading && (!myCourses?.items || myCourses?.items?.length === 0);

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
