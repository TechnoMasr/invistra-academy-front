import CertificatesCard from "@/components/cards/CertificatesCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import MyCertificatesSkeleton from "@/components/Loading/SkeletonLoading/MyCertificatesSkeleton";

const MyCertificates = () => {
  const { t } = useTranslation();

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

  // <MyCertificatesSkeleton />

  return (
    <div className="space-y-6">
      <ProfileTitle title="شهاداتي" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list?.map((item) => (
          <CertificatesCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
