import LectureCard from "@/components/cards/LectureCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import LecturesPageSkeleton from "@/components/Loading/SkeletonLoading/LecturesPageSkeleton";

const Lectures = () => {
  const { t } = useTranslation();

  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "مقدمة في اللغة الإنجليزية",
    duration: "2 ساعات",
    number: index + 1,
  }));

  // <LecturesPageSkeleton/>

  return (
    <div className="space-y-6">
      <ProfileTitle title="محاضرات الكورس" />

      <div className="grid grid-cols-1 gap-4">
        {list?.map((item) => (
          <LectureCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Lectures;
