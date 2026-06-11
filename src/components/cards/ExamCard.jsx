import { FaRegCircleQuestion } from "react-icons/fa6";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";

const ExamCard = ({ item }) => {
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

      <div className="flex items-center gap-2">
        <p className="font-medium text-xs py-1 px-4 text-green-500 border border-green-500 rounded-full">
          اختبار قادم
        </p>
        <p className="font-medium text-xs py-1 px-4 text-green-500 border border-green-500 rounded-full flex items-center gap-1">
          5 اسئلة <FaRegCircleQuestion />
        </p>
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

      <hr className="my-2" />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p>درجة الاختبار: 7 / 10</p>

        <Link
          to={`/profile/exam-details/${item.id}`}
          className="font-medium text-xs py-1 px-4 text-primary border border-primary rounded-full"
        >
          عرض الاختبار
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;
