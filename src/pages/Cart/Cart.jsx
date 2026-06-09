import CartCard from "@/components/cards/CartCard";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import CartPageSkeleton from "@/components/Loading/SkeletonLoading/CartSkeletonPage";
import { useTranslation } from "react-i18next";

import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import OrderSummaryCard from "./sections/OrderSummaryCard";

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
    <main className="container pagePadding">
      <h2 className="flex items-center gap-2 text-4xl font-semibold mb-6">
        <span className="bg-secondary brightness-75 w-0.75 h-7 rounded-full" />
        سلة المشتريات
      </h2>

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
