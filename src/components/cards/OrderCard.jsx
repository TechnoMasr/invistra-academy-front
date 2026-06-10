import { HiOutlineCollection } from "react-icons/hi";

const OrderCard = ({ item }) => {
  return (
    <div
      key={item.id}
      className="border rounded-lg overflow-hidden bg-white hover:shadow-xl hover:border-primary hover:bg-primary/5 transition duration-300 ease-in-out"
    >
      <div className="w-full aspect-5/3 overflow-hidden">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 lg:gap-4 p-4">
        <h3 className="text-2xl font-bold line-clamp-2">{item.title}</h3>

        <p className="line-clamp-2">{item.description}</p>

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
          <div className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold">
            <HiOutlineCollection size={18} />
            {item.lecture_number} محاضرة
          </div>

          <p className="text-2xl font-bold text-green-500">${item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
