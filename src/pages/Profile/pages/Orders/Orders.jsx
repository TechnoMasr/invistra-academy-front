import OrderCard from "@/components/cards/OrderCard";

import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";

const Orders = () => {
  const { t } = useTranslation();

  const orders = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    code: "123456789123456789",
    date: "2023-06-01",
    payment_method: "cash on delivery",
    status: "pending",
    payment_status: "unpaid",
    price: 100,
  }));

  // const isEmpty = !isLoading && (orders?.length === 0 || !orders);

  return (
    <div className="space-y-6">
      <ProfileTitle title="طلباتي" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders?.map((item) => (
          <OrderCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
