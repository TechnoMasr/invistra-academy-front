import TeacherExamCard from "@/components/cards/TeacherExamCard";

import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import userImg from "@/assets/icons/Icon (1).png";
import { Link } from "react-router";
import { LuCirclePlus } from "react-icons/lu";
import MyExamsSkeleton from "@/components/Loading/SkeletonLoading/MyExamsSkeleton";

const TeacherExams = () => {
  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "اللغة الانجليزية - المستوى الأول",
    description:
      "طوّر مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل والحياة اليومية",
    price: 50,
    lecture_number: 12,
    teacher: {
      name: "بودا سلطان",
      image: userImg,
    },
    slug: "بودا-سلطان",
  }));

  // <MyExamsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title="اختباراتي" />

        <Link
          to="/profile/add-exam"
          className="font-medium py-1 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm"
        >
          <LuCirclePlus className="w-4 h-4" />
          <span>إضافة اختبار</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list?.map((item) => (
          <TeacherExamCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TeacherExams;
