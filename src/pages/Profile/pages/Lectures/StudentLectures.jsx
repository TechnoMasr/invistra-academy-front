import LectureCard from "@/components/cards/LectureCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import LecturesPageSkeleton from "@/components/Loading/SkeletonLoading/LecturesPageSkeleton";
import { getMyLectures } from "@/api/ordersServices";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/sections/EmptyDataSection";

const Lectures = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { data: lectures, isLoading } = useQuery({
    queryKey: ["lectures", id],
    queryFn: () => getMyLectures(id),
  });

  const isEmpty = !isLoading && (lectures?.length === 0 || !lectures);

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("studentLectures.title")} />

      {isLoading ? (
        <LecturesPageSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("studentLectures.emptyMessage")} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lectures?.map((item) => (
            <LectureCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lectures;
