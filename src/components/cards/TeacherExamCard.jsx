import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { RiErrorWarningLine } from "react-icons/ri";
import { PiExam } from "react-icons/pi";

const TeacherExamCard = ({ item }) => {
  return (
    <div key={item?.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold line-clamp-2">{item?.title}</h3>

      <p className="opacity-70 font-medium line-clamp-2">{item?.course_name}</p>

      <p className="text-sm flex items-center gap-1 font-semibold">
        <SlLayers />
        {item?.category}
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-amber-500">
        <RiErrorWarningLine /> يجب ان يتجاوز {item?.pass_mark} للنجاح
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-orange-600">
        <PiExam />
        درجة الاختبار من {item?.full_mark}
      </p>

      <div className="flex items-center gap-2">
        <div className="w-8 aspect-square overflow-hidden rounded-full">
          <img
            loading="lazy"
            src={item?.instructor_image}
            alt={item?.instructor_name}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-medium">{item?.instructor_name}</h4>
      </div>

      <Link
        to={`/profile/edit-exam/${item?.id}`}
        className="flex-1 rounded-full"
      >
        <Button variant="outline" className={`w-full`}>
          عرض تفاصيل الاختبار
        </Button>
      </Link>
    </div>
  );
};

export default TeacherExamCard;
