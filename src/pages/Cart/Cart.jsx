import CartCard from "@/components/cards/CartCard";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import CartPageSkeleton from "@/components/Loading/SkeletonLoading/CartSkeletonPage";
import { useTranslation } from "react-i18next";
import OrderSummaryCard from "./sections/OrderSummaryCard";
import ProfileTitle from "@/components/common/ProfileTitle";
import { getCart } from "@/api/cartServices";
import { useQuery } from "@tanstack/react-query";

const Cart = () => {
  const { t } = useTranslation();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const isCartEmpty = !isLoading && (cart?.items?.length === 0 || !cart);

  return (
    <main className="container pagePadding space-y-6">
      <ProfileTitle title={t("cart.title")} />

      {isLoading ? (
        <CartPageSkeleton />
      ) : isCartEmpty ? (
        <EmptyDataSection msg={t("cart.emptyMessage")} />
      ) : (
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {cart?.items?.map((item) => (
              <CartCard
                key={item.id}
                item={item?.course}
                course_id={item?.id}
              />
            ))}
          </div>

          <OrderSummaryCard
            summary={cart?.summary}
            payment_methods={cart?.payment_methods}
          />
        </section>
      )}
    </main>
  );
};

export default Cart;
