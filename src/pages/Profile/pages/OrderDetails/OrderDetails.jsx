import OrdersDetailsCard from "@/components/cards/OrdersDetailsCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import OrderDetailsSkeleton from "@/components/Loading/SkeletonLoading/OrderDetailsSkeleton";
import { getMyOrdersDetails } from "@/api/ordersServices";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const OrderDetails = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["ordersDetails", id],
    queryFn: () => getMyOrdersDetails(id),
  });

  const isEmpty = !isLoading && (orders?.items?.length === 0 || !orders);

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("orderDetails.title")} />

      {isLoading ? (
        <OrderDetailsSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("orderDetails.emptyMessage")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders?.items?.map((item) => (
            <OrdersDetailsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
