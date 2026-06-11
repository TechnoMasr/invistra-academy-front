import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { RiErrorWarningLine } from "react-icons/ri";
import { PiExam } from "react-icons/pi";

const TeacherExamCard = ({ item }) => {
  return (
    <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold line-clamp-2">{item.title}</h3>

      <p className="opacity-70 font-medium line-clamp-2">
        اللغة الانجليزية - المستوى الأول
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold">
        <SlLayers />
        قسم اللغة انجليزية
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-amber-500">
        <RiErrorWarningLine /> يجب ان يتجاوز 5 أجوبة صحيحة للنجاح
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-orange-600">
        <PiExam />
        درجة الاختبار من 10
      </p>

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

      <Link
        to={`/profile/edit-exam/${item.id}`}
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
