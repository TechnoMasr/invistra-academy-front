import TeacherCourseCard from "@/components/cards/TeacherCourseCard";
import ProfileTitle from "@/components/common/ProfileTitle";
import { LuCirclePlus } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";
import { getMyCoursesInstructor } from "@/api/myCoursesServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import { useTranslation } from "react-i18next";
import MainPagination from "@/components/common/MainPagination";
import useRequireAuth from "@/hooks/useRequireAuth";

const TeacherCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [page, setPage] = useState(1);

  const { data: myCourses, isLoading } = useQuery({
    queryKey: ["myCoursesTeacher", page],
    queryFn: () => getMyCoursesInstructor({ page }),
  });

  const isEmpty =
    !isLoading && (!myCourses?.items || myCourses?.items?.length === 0);

  const totalPages = myCourses?.meta?.last_page || 1;

  const handleGoToPage = (newPage) => {
    requireAuth(() => {
      navigate(newPage);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title={t("teacherCourses.title")} />

        <button
          onClick={() => handleGoToPage("/profile/add-course")}
          className="font-medium py-1 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <LuCirclePlus className="w-4 h-4" />
          <span>{t("teacherCourses.addCourse")}</span>
        </button>
      </div>

      {isLoading ? (
        <MyCoursesSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("teacherCourses.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses?.items?.map((item) => (
              <TeacherCourseCard key={item.id} item={item} />
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

export default TeacherCourses;
