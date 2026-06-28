import { FaRegCircleQuestion } from "react-icons/fa6";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { Button } from "../ui/button";
import {
  RiErrorWarningLine,
  RiFileList3Line,
  RiTimerLine,
} from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { useTranslation } from "react-i18next";

const ExamCard = ({ item }) => {
  const { t } = useTranslation();

  // الحالات الثلاثة بناءً على الـ status
  const isCompleted = item?.status === "ended";
  const isRetryAvailable = item?.status === "retry_available";
  const isComing = item?.status === "coming";

  const timeInMinutes = item?.duration;

  // دالة لتحويل الدقائق إلى صيغة HH:MM
  const formatTime = (totalMinutes) => {
    if (!totalMinutes) return "";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div key={item?.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold line-clamp-2">{item?.title}</h3>

      <p className="opacity-70 font-medium line-clamp-2">{item?.course_name}</p>

      <p className="text-sm flex items-center gap-1 font-semibold">
        <SlLayers />
        {item?.category_name}
      </p>

      <div className="flex items-center flex-wrap gap-2">
        <p
          className={`font-medium text-xs py-1 px-4 border rounded-full ${
            isCompleted
              ? "text-red-600 border-red-600"
              : isRetryAvailable
                ? "text-primary border-primary"
                : "bg-green-50 text-green-700 border border-green-400"
          }`}
        >
          {t("examCard.exam")}: {item?.status_translated}
        </p>
        <p className="font-medium text-xs py-1 px-4 text-amber-500 border border-amber-500 rounded-full flex items-center gap-1">
          {t("examCard.questions", { count: item?.questions_count })}{" "}
          <FaRegCircleQuestion className="w-4 h-4" />
        </p>

        {!isCompleted && timeInMinutes && (
          <p className="font-medium text-xs py-1 px-4 text-sky-600 border border-sky-600 rounded-full flex items-center gap-1">
            {formatTime(timeInMinutes)}
            <RiTimerLine className="w-4 h-4" />
          </p>
        )}
      </div>

      <p className="text-sm flex items-center gap-1 font-semibold text-orange-600">
        {t("examCard.attempts", {
          count: item?.attempts_count,
          max: item?.max_attempts,
        })}
      </p>

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

      <hr className="mt-auto" />

      {!item?.is_accessible ? (
        <>
          {/* شريط تقدم مخصص بـ Tailwind */}
          <div className="flex flex-col gap-1 my-1">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700">
              <span>{t("examCard.progress", "نسبة مشاهدة الدورة")}</span>
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

          <div className="bg-gray-100 border border-gray-600 py-1 px-4 rounded-lg flex items-center justify-center text-center gap-1">
            <p className="font-medium text-gray-600 flex items-center gap-1">
              {t("examCard.notAccessible", {
                percentage: item?.required_watch_percentage,
              })}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 my-2 text-center text-xs">
            {/* صندوق درجة الاختبار */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-primary font-medium block mb-0.5">
                {t("examCard.testScoreLabel", "درجة الاختبار")}
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {item?.score !== null ? item?.score : "??"}{" "}
                <span className="text-gray-600 font-normal">
                  / {item?.full_mark}
                </span>
              </span>
            </div>

            {/* صندوق درجة النجاح */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-primary font-medium block mb-0.5">
                {t("examCard.passMarkLabel", "درجة النجاح")}
              </span>
              <span className="font-bold text-green-600 text-sm">
                {item?.pass_mark}
              </span>
            </div>

            {/* صندوق التقدير - يظهر بكامل العرض لو شاشة صغيرة، أو في خانة ثالثة لو شاشة واسعة */}
            {item?.grade ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex flex-col justify-center">
                <span className="text-primary font-medium block mb-0.5">
                  {t("examCard.gradeLabel", "التقدير")}
                </span>
                <span className="font-extrabold text-primary text-sm">
                  {item?.grade}
                </span>
              </div>
            ) : (
              // للحفاظ على توازن الـ Grid إذا لم يكن هناك تقدير على الشاشات الكبيرة
              <div className="hidden sm:block opacity-0" />
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isCompleted || isRetryAvailable ? (
              <Link
                to={`/profile/exam-result/${item?.id}`}
                className="rounded-full flex-1"
              >
                <Button variant="outline" className="w-full">
                  <RiFileList3Line />
                  {t("examCard.viewExam")}
                </Button>
              </Link>
            ) : null}

            {isRetryAvailable || isComing ? (
              <Link
                to={`/enter-exam/${item?.id}`}
                className="rounded-full flex-1"
              >
                <Button className="w-full">
                  <GrEdit />
                  {t("examCard.startExam")}
                </Button>
              </Link>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamCard;
