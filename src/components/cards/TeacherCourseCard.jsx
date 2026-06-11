import { FaBoxOpen } from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { Link } from "react-router";
import { Button } from "../ui/button";

const TeacherCourseCard = ({ item }) => {
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

        <div className="flex items-center justify-between flex-wrap gap-2">
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

          <p className="font-medium text-xs py-1 px-4 text-green-500 border border-green-500 rounded-full flex items-center gap-1">
            <FaBoxOpen />
            10 طلبات
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-1">
          <p className="font-semibold">السعر:</p>
          <span className="text-2xl font-bold text-green-500">
            ${item.price}
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            to={`/profile/edit-course/${item.id}`}
            className="flex-1 rounded-full"
          >
            <Button variant="outline" className={`w-full`}>
              عرض تفاصيل الكورس
            </Button>
          </Link>
          <Link
            to={`/profile/add-lecture/${item.id}`}
            className="flex-1 rounded-full"
          >
            <Button className={`w-full`}>اضافة محاضرة</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseCard;
