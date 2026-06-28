import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

const OrdersDetailsCard = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-lg overflow-hidden bg-white flex flex-col xs:flex-row items-start gap-4 p-4">
      <div className="w-full h-50 xs:w-36 xs:h-36 md:w-30 md:h-30 xl:w-40 xl:h-40 aspect-square shrink-0 rounded-md overflow-hidden border">
        {item?.image && (
          <img
            loading="lazy"
            src={item?.image}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full">
        <h3 className="text-lg font-bold line-clamp-2">{item?.name}</h3>

        <p className="line-clamp-2 text-sm text-gray-600">
          {item?.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-sm text-gray-500">
          <p className="flex items-center gap-1">
            <HiOutlineSquares2X2 />
            {t("ordersDetailsCard.lecturesCount", {
              count: item?.lectures_count,
            })}
          </p>
          <p className="flex items-center gap-1">
            <SlLayers />
            {item?.category}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-1 text-sm">
          <p className="font-medium">{t("ordersDetailsCard.courseStatus")}</p>
          <span className="font-semibold">{item?.status}</span>
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="w-8 h-8 shrink-0 overflow-hidden border rounded-full">
            {item?.instructor_image && (
              <img
                loading="lazy"
                src={item?.instructor_image}
                alt={item?.instructor}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h4 className="font-medium text-sm">{item?.instructor}</h4>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-50 mt-auto">
          <div>
            {item?.price_before_discount ? (
              <p className="text-sm font-semibold text-red-500 line-through">
                {item?.price_before_discount} {item?.currency}
              </p>
            ) : null}
            <p className="text-2xl font-bold text-green-500">
              {item?.price} {item?.currency}
            </p>
          </div>

          <Link
            to={`/profile/lectures/${item?.id}`}
            className="xs:w-auto w-full rounded-full"
          >
            <Button size="sm" variant="outline" className={`w-full`}>
              {t("ordersDetailsCard.viewLectures")}
            </Button>
          </Link>
        </div>

        {/* شريط تقدم مخصص بـ Tailwind */}
        <div className="flex flex-col gap-1 my-1">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
            <span>{t("ordersDetailsCard.progress", "نسبة مشاهدة الدورة")}</span>
            <span dir="ltr" className="font-semibold">
              {item?.watched_lectures}/{item?.lectures_count} (
              {Math.round(item?.progress_percentage || 0)}%)
            </span>
          </div>

          {/* خلفية الشريط */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200/50">
            {/* الجزء الملون الممثل للنسبة */}
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${item?.progress_percentage || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetailsCard;
