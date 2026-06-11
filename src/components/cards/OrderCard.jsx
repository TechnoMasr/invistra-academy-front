import image from "@/assets/images/hero.png";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router";

const OrderCard = ({ item }) => {
  return (
    <div
      key={item.id}
      className="border rounded-lg p-3 flex flex-col gap-2"
    >
      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">كود الطلب:</p>
        <span>{item.code}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">حالة الدفع:</p>
        <span>{item.status}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">حالة الطلب:</p>
        <span>{item.payment_status}</span>
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <p className="font-semibold">
          <IoCalendarOutline size={20} />
        </p>
        <span>{item.date}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-12 aspect-square overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">فودافون كاش</h3>
          <p className="text-sm opacity-90">تحويل فوري عبر المحفظة</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center flex-wrap gap-1">
          <p className="font-semibold">السعر:</p>
          <span className="text-2xl font-bold text-green-500">
            ${item.price}
          </span>
        </div>

        <Link
          to={`/profile/order-details/${item.id}`}
          className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold hover:bg-primary/10 transition"
        >
          عرض تفاصيل الطلب
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
