import { FaRegCircleQuestion } from "react-icons/fa6";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { RiFileList3Line, RiTimerLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { GraduationCap, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const ExamCard = ({ item }) => {
  const { t } = useTranslation();

  // نوع الاختبار
  const isFinal = item?.exam_type === "final";

  // الحالات الثلاثة بناءً على الـ status
  const isCompleted = item?.status === "ended";
  const isRetryAvailable = item?.status === "retry_available";
  const isComing = item?.status === "coming";

  return (
    <div
      key={item?.id}
      className="group relative border rounded-xl p-4 flex flex-col gap-3 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Header Badges: نوع الاختبار والحالة */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isFinal
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          }`}
        >
          {isFinal ? (
            <>
              <GraduationCap className="w-3.5 h-3.5" />
              {t("examCard.finalExam")}
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              {t("examCard.lectureExam")}
            </>
          )}
        </span>

        <p
          className={`font-medium text-xs py-1 px-3 border rounded-full ${
            isCompleted
              ? "text-red-600 border-red-600 bg-red-50 dark:bg-red-950/30"
              : isRetryAvailable
                ? "text-primary border-primary bg-primary/5"
                : "bg-green-50 text-green-700 border-green-400 dark:bg-green-950/30 dark:text-green-300"
          }`}
        >
          {t("examCard.exam")}: {item?.status_translated}
        </p>
      </div>

      {/* العنوان واسم الكورس */}
      <div className="space-y-1">
        <h3 className="text-base font-bold line-clamp-2 group-hover:text-primary transition-colors">
          {item?.title}
        </h3>
        <p className="opacity-70 font-medium text-xs line-clamp-1">
          {item?.course_name}
        </p>
      </div>

      {/* اسم المحاضرة إذا كان اختبار محاضرة */}
      {!isFinal && item?.lecture_name && (
        <div className="text-xs bg-muted/70 px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5">
          <span className="font-semibold text-foreground shrink-0">
            {t("examCard.lectureLabel")}:
          </span>
          <span className="truncate">{item?.lecture_name}</span>
        </div>
      )}

      {/* الفئة، الأسئلة، والوقت */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        {item?.category_name && (
          <p className="flex items-center gap-1 font-semibold text-muted-foreground">
            <SlLayers />
            {item?.category_name}
          </p>
        )}

        <p className="font-medium py-1 px-3 text-amber-500 border border-amber-500/30 bg-amber-500/5 rounded-full flex items-center gap-1">
          {t("examCard.questions", { count: item?.questions_count })}
          <FaRegCircleQuestion className="w-3.5 h-3.5" />
        </p>

        {!isCompleted && item?.duration && (
          <p className="font-medium py-1 px-3 text-sky-600 border border-sky-600/30 bg-sky-500/5 rounded-full flex items-center gap-1">
            {item?.duration} {t("teacherExamCard.minutes")}
            <RiTimerLine className="w-3.5 h-3.5" />
          </p>
        )}
      </div>

      {/* المحاولات */}
      <p className="text-xs flex items-center gap-1 font-semibold text-orange-600">
        {t("examCard.attempts", {
          count: item?.attempts_count,
          max: item?.max_attempts,
        })}
      </p>

      {/* المحاضر */}
      <div className="flex items-center gap-2 pt-1">
        <div className="w-8 aspect-square overflow-hidden rounded-full border bg-muted shrink-0">
          {item?.instructor_image ? (
            <img
              loading="lazy"
              src={item?.instructor_image}
              alt={item?.instructor_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
              {item?.instructor_name?.charAt(0)}
            </div>
          )}
        </div>
        <h4 className="font-medium text-xs truncate">
          {item?.instructor_name}
        </h4>
      </div>

      <hr className="mt-auto" />

      {/* القسم السفلي: التقدم أو الدرجات والأزرار */}
      {!item?.is_accessible ? (
        <>
          {/* يظهر شريط التقدم فقط للاختبارات النهائية */}
          {isFinal ? (
            <div className="flex flex-col gap-1 my-1">
              <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>{t("examCard.progress")}</span>
                <span dir="ltr" className="font-semibold">
                  {item?.watched_lectures}/{item?.lectures_count} (
                  {Math.round(item?.progress_percentage || 0)}%)
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item?.progress_percentage || 0}%` }}
                />
              </div>

              <div className="bg-gray-100 dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700 py-1.5 px-3 rounded-lg flex items-center justify-center text-center mt-1">
                <p className="font-medium text-xs text-gray-600 dark:text-slate-400">
                  {t("examCard.notAccessible", {
                    percentage: item?.required_watch_percentage,
                  })}
                </p>
              </div>
            </div>
          ) : (
            /* رسالة الاختبار المربوط بمحاضرة بدون شريط تقدم */
            <div className="bg-amber-500/10 border border-amber-500/20 py-2 px-3 rounded-lg text-center my-1">
              <p className="font-medium text-xs text-amber-700 dark:text-amber-400">
                {t("examCard.lectureNotAccessible")}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* شبكة الدرجات */}
          <div className="grid grid-cols-3 gap-2 my-1 text-center text-xs">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-primary font-medium block mb-0.5">
                {t("examCard.testScoreLabel", "درجة الاختبار")}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {item?.score !== null ? item?.score : "??"}{" "}
                <span className="text-gray-500 font-normal">
                  / {item?.full_mark}
                </span>
              </span>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-primary font-medium block mb-0.5">
                {t("examCard.passMarkLabel", "درجة النجاح")}
              </span>
              <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                {item?.pass_mark}
              </span>
            </div>

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
              <div className="hidden sm:block opacity-0" />
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2 flex-wrap">
            {(isCompleted || isRetryAvailable) && (
              <Link
                to={`/profile/exam-result/${item?.id}`}
                className="rounded-full flex-1"
              >
                <Button variant="outline" className="w-full text-xs">
                  <RiFileList3Line />
                  {t("examCard.viewExam")}
                </Button>
              </Link>
            )}

            {(isRetryAvailable || isComing) && (
              <Link
                to={`/enter-exam/${item?.id}`}
                className="rounded-full flex-1"
              >
                <Button className="w-full text-xs">
                  <GrEdit />
                  {t("examCard.startExam")}
                </Button>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamCard;
