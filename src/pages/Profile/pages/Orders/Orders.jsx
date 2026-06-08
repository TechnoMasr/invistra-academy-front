import SectionTitle from "@/components/common/SectionTitle";
import OrderCard from "@/components/cards/OrderCard";
import { getOrders, getOrdersStatus } from "@/api/cartServices";
import { useQuery } from "@tanstack/react-query";
import MyOrdersSkeleton from "@/components/Loading/SkeletonLoading/MyOrdersSkeleton";
import OptionSelector from "@/components/common/OptionSelector";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import { useSearchParams } from "react-router";
import MainPagination from "@/components/common/MainPagination";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedStatus = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page")) || 1;

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", selectedStatus, page],
    queryFn: () => getOrders(selectedStatus, page),
  });

  const { data: ordersStatus } = useQuery({
    queryKey: ["orders_status"],
    queryFn: getOrdersStatus,
  });

  const isEmpty = !isLoading && (orders?.items?.length === 0 || !orders);

  const filterList = [
    {
      value: "all",
      label: t("ordersPage.all"),
    },
    ...(ordersStatus?.map((item) => ({
      value: item.value,
      label: item.label,
    })) || []),
  ];

  const handleSelect = (item) => {
    if (item.value === "all") {
      setSearchParams({ page: 1 });
    } else {
      setSearchParams({ status: item.value, page: 1 });
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle title={t("ordersPage.title")} />

      <OptionSelector
        options={filterList}
        selected={selectedStatus}
        onSelect={handleSelect}
        getLabel={(item) => item.label}
        getValue={(item) => item.value}
      />

      {isLoading ? (
        <MyOrdersSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("ordersPage.noOrders")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders?.items?.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <MainPagination
        totalPages={orders?.meta?.last_page}
        currentPage={page}
        onPageChange={(newPage) => {
          const params = {};
          if (selectedStatus && selectedStatus !== "all")
            params.status = selectedStatus;
          params.page = newPage;
          setSearchParams(params);
        }}
      />
    </div>
  );
};

export default Orders;
