import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const OrderCard = ({ item }) => {
  const { t } = useTranslation();
  //  formate date 2026-06-16T09:47:06.000000Z
  const date = new Date(item.date).toLocaleDateString("en-GB");
  return (
    <div key={item.id} className="border rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">{t("orderCard.orderCode")}</p>
        <span>{item.order_code}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">{t("orderCard.paymentStatus")}</p>
        <span>{item.payment_status}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">{t("orderCard.orderStatus")}</p>
        <span>{item.order_status}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">{t("orderCard.paymentMethod")}</p>
        <span>{item.payment_method}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">
          <IoCalendarOutline size={20} />
        </p>
        <span>{date}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center flex-wrap gap-1">
          <p className="font-semibold">{t("orderCard.price")}</p>
          <span className="text-2xl font-bold text-green-500">
            {item.total_price} {item.currency}
          </span>
        </div>

        <Link
          to={`/profile/order-details/${item.id}`}
          className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold hover:bg-primary/10 transition"
        >
          {t("orderCard.viewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
