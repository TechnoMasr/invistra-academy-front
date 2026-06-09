import { HiOutlineCollection } from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineDelete } from "react-icons/md";
import { SlLayers } from "react-icons/sl";

const CartCard = ({ item }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white flex items-start gap-4 p-4">
      <div className="w-1/3 aspect-6/4 rounded-md overflow-hidden">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <h3 className="text-lg lg:text-2xl font-bold line-clamp-2">{item.title}</h3>

        <div className="flex flex-wrap items-center gap-2 font-medium text-sm lg:text-base mb-3">
          <p className="flex items-center gap-1">
            <HiOutlineSquares2X2 />
            10 محاضرات
          </p>
          <p className="flex items-center gap-1">
            <SlLayers />
            قسم اللغة انجليزية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden rounded-full">
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

          <button className="flex items-center gap-1 text-destructive bg-destructive/20 px-4 py-1 rounded-full cursor-pointer">
            حذف <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
