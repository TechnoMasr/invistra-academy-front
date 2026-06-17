import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import MyExamsSkeleton from "@/components/Loading/SkeletonLoading/MyExamsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getExamsInstructor } from "@/api/ExamSecvices";
import { useState } from "react";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";
import ExamCard from "@/components/cards/ExamCard";

const StudentExams = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: exams, isLoading } = useQuery({
    queryKey: ["examsInstructor", page],
    queryFn: () => getExamsInstructor({ page }),
  });

  const isEmpty = !isLoading && (!exams?.items || exams?.items?.length === 0);

  const totalPages = exams?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title="اختباراتي" />

      {isLoading ? (
        <MyExamsSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("exams.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {exams?.items?.map((item) => (
              <ExamCard key={item.id} item={item} />
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

export default StudentExams;
