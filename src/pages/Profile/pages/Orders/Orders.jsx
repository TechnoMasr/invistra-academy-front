import { useState } from "react";
import OrderCard from "@/components/cards/OrderCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import OrdersSkeleton from "@/components/Loading/SkeletonLoading/OrdersSkeleton";
import { getMyOrders } from "@/api/ordersServices";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";

const Orders = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getMyOrders({ page }),
  });

  const isEmpty = !isLoading && (orders?.items?.length === 0 || !orders);

  const totalPages = orders?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("orders.title")} />

      {isLoading ? (
        <OrdersSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("orders.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders?.items?.map((item) => (
              <OrderCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <MainPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
