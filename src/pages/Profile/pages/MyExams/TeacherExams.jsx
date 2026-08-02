import TeacherExamCard from "@/components/cards/TeacherExamCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import { Link, useNavigate } from "react-router";
import { LuCirclePlus } from "react-icons/lu";
import MyExamsSkeleton from "@/components/Loading/SkeletonLoading/MyExamsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getExamsInstructor } from "@/api/ExamServices";
import { useState } from "react";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";
import useRequireAuth from "@/hooks/useRequireAuth";

const TeacherExams = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [page, setPage] = useState(1);

  const { data: exams, isLoading } = useQuery({
    queryKey: ["examsInstructor", page],
    queryFn: () => getExamsInstructor({ page }),
  });

  const isEmpty = !isLoading && (!exams?.items || exams?.items?.length === 0);

  const totalPages = exams?.meta?.last_page || 1;

  const handleGoToPage = (newPage) => {
    requireAuth(() => {
      navigate(newPage);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title={t("teacherExams.title")} />

        <button
          onClick={() => handleGoToPage("/profile/add-exam")}
          className="font-medium py-1 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <LuCirclePlus className="w-4 h-4" />
          <span>{t("teacherExams.addExam")}</span>
        </button>
      </div>

      {isLoading ? (
        <MyExamsSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("teacherExams.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {exams?.items?.map((item) => (
              <TeacherExamCard key={item.id} item={item} />
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

export default TeacherExams;
