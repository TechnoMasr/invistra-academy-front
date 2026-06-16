import TeacherCourseCard from "@/components/cards/TeacherCourseCard";

import ProfileTitle from "@/components/common/ProfileTitle";
import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";

const TeacherCourses = () => {
  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "اللغة الانجليزية - المستوى الأول",
    description:
      "طوّر مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل والحياة اليومية",
    image: image,
    price: 50,
    lecture_number: 12,
    teacher: {
      name: "بودا سلطان",
      image: userImg,
    },
    slug: "بودا-سلطان",
  }));

  // const isEmpty = !isLoading && (orders?.length === 0 || !orders);

  // <MyCoursesSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title="كورساتي" />

        <Link
          to="/profile/add-course"
          className="font-medium py-1 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm"
        >
          <LuCirclePlus className="w-4 h-4" />
          <span>إضافة كورس</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list?.map((item) => (
          <TeacherCourseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
