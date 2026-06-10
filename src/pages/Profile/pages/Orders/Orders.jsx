import OrderCard from "@/components/cards/OrderCard";
import MyOrdersSkeleton from "@/components/Loading/SkeletonLoading/MyOrdersSkeleton";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";
import { useTranslation } from "react-i18next";
import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";

const Orders = () => {
  const { t } = useTranslation();

  const orders = Array.from({ length: 9 }, (_, index) => ({
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

  const isLoading = false;

  const isEmpty = !isLoading && (orders?.length === 0 || !orders);

  return (
    <div className="space-y-6">
      <h2>الطلبات</h2>

      {isLoading ? (
        <MyOrdersSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("ordersPage.noOrders")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders?.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <MainPagination totalPages={10} currentPage={1} onPageChange={() => {}} />
    </div>
  );
};

export default Orders;
