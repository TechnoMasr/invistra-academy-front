import OrderCard from "@/components/cards/OrderCard";

import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import OrdersSkeleton from "@/components/Loading/SkeletonLoading/OrdersSkeleton";
import { getMyOrders } from "@/api/ordersServices";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/sections/EmptyDataSection";

const Orders = () => {
  const { t } = useTranslation();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
  });

  const isEmpty = !isLoading && (orders?.items?.length === 0 || !orders);

  return (
    <div className="space-y-6">
      <ProfileTitle title="طلباتي" />

      {isLoading ? (
        <OrdersSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("Orders.emptyMessage")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders?.items?.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
