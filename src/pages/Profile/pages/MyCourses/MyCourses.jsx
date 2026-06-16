import OrdersDetailsCard from "@/components/cards/OrdersDetailsCard";

import ProfileTitle from "@/components/common/ProfileTitle";
import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";

const MyCourses = () => {
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
      <ProfileTitle title="كورساتي" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list?.map((item) => (
          <OrdersDetailsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
