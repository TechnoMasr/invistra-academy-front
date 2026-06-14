import CartCard from "@/components/cards/CartCard";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import CartPageSkeleton from "@/components/Loading/SkeletonLoading/CartSkeletonPage";
import { useTranslation } from "react-i18next";

import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import OrderSummaryCard from "./sections/OrderSummaryCard";
import ProfileTitle from "@/components/common/ProfileTitle";

const Cart = () => {
  const { t } = useTranslation();

  const isLoading = false;

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

  const isCartEmpty = !isLoading && (list?.length === 0 || !list);

  return (
    <main className="container pagePadding space-y-6">
      <ProfileTitle title="سلة المشتريات" />

      {isLoading ? (
        <CartPageSkeleton />
      ) : isCartEmpty ? (
        <EmptyDataSection msg={t("Cart.emptyMessage")} />
      ) : (
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {list?.map((item) => (
              <CartCard key={item.id} item={item} />
            ))}
          </div>

          <OrderSummaryCard />
        </section>
      )}
    </main>
  );
};

export default Cart;
