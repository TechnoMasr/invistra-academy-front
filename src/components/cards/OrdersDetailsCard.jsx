import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";

const OrdersDetailsCard = ({ item }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white flex items-start gap-3 p-3">
      <div className="w-1/3 aspect-square rounded-md overflow-hidden">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <h3 className="text-lg font-bold line-clamp-2">{item.title}</h3>

        <p className="line-clamp-2 text-sm">{item.description}</p>

        <div className="flex flex-wrap items-center gap-2 font-semibold text-sm">
          <p className="flex items-center gap-1">
            <HiOutlineSquares2X2 />
            10 محاضرات
          </p>
          <p className="flex items-center gap-1">
            <SlLayers />
            قسم اللغة انجليزية
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-1">
          <p className="font-medium">حالة الكورس:</p>
          <span>{item.code}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 aspect-square overflow-hidden rounded-full">
            <img
              loading="lazy"
              src={item.teacher.image}
              alt={item.teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-medium">{item.teacher.name}</h4>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-3xl font-bold text-green-500">${item.price}</p>

          <Link
            to={`/profile/lectures/${item.id}`}
            className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold hover:bg-primary/10 transition"
          >
            عرض المحاضرات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetailsCard;
