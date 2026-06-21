import { FaRegCircleQuestion } from "react-icons/fa6";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { RiFileList3Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { useTranslation } from "react-i18next";

const ExamCard = ({ item }) => {
  const { t } = useTranslation();
  const isCompleted = item?.status === "ended";
  return (
    <div key={item?.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold line-clamp-2">{item?.title}</h3>

      <p className="opacity-70 font-medium line-clamp-2">{item?.course_name}</p>

      <p className="text-sm flex items-center gap-1 font-semibold">
        <SlLayers />
        {item?.category_name}
      </p>

      <div className="flex items-center gap-2">
        <p
          className={`font-medium text-xs py-1 px-4 border  rounded-full ${
            isCompleted
              ? "text-red-600 border-red-600"
              : "bg-green-50 text-green-700 border border-green-400"
          }`}
        >
          {t("examCard.exam")}: {item?.status_translated}
        </p>
        <p className="font-medium text-xs py-1 px-4 text-amber-500 border border-amber-500 rounded-full flex items-center gap-1">
          {t("examCard.questions", { count: item?.questions_count })}{" "}
          <FaRegCircleQuestion />
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 aspect-square overflow-hidden rounded-full border">
          {item?.instructor_image && (
            <img
              loading="lazy"
              src={item?.instructor_image}
              alt={item?.instructor_name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <h4 className="font-medium">{item?.instructor_name}</h4>
      </div>

      <hr className="my-2" />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p>
          {t("examCard.testScore", { score: item?.score ? item?.score : "??" })}
        </p>

        {isCompleted ? (
          <Link
            to={`/profile/exam-result/${item?.id}`}
            className="rounded-full"
          >
            <Button variant="outline">
              <RiFileList3Line />
              {t("examCard.viewExam")}
            </Button>
          </Link>
        ) : (
          <Link to={`/enter-exam/${item?.id}`} className="rounded-full">
            <Button>
              <GrEdit />
              {t("examCard.startExam")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
