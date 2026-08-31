import TeacherLectureCard from "@/components/cards/TeacherLectureCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import LecturesPageSkeleton from "@/components/Loading/SkeletonLoading/LecturesPageSkeleton";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import { getLecturesInstructor } from "@/api/lectureServices";
import { buttonVariants } from "@/components/ui/button";
import { LuCirclePlus } from "react-icons/lu";

const Lectures = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { data: lectures, isLoading } = useQuery({
    queryKey: ["lecturesInstructor", id],
    queryFn: () => getLecturesInstructor(id),
  });

  const isEmpty = !isLoading && (lectures?.length === 0 || !lectures);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title={t("teacherLectures.title")} />

        <Link
          to={`/profile/add-lecture/${id}`}
          className={`${buttonVariants({  size: "sm" })}`}
        >
          <LuCirclePlus className="w-4 h-4" />
          <span>{t("teacherCourseCard.addLecture")}</span>
        </Link>
      </div>

      {isLoading ? (
        <LecturesPageSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("teacherLectures.emptyMessage")} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lectures?.map((item) => (
            <TeacherLectureCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lectures;
