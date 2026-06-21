import { getExamsResult } from "@/api/ExamServices";
import ProfileTitle from "@/components/common/ProfileTitle";
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const ExamResult = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  // 1. جلب بيانات النتيجة الحقيقية
  const { data: examData, isLoading } = useQuery({
    queryKey: ["examsResult", id],
    queryFn: () => getExamsResult(id),
  });

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // استخراج القائمة والبيانات الأساسية من الـ API
  const questionsList = examData?.questions || [];
  const isPassed = examData?.passed;

  return (
    <div className="space-y-6">
      {/* الهيدر العلوي وعرض حالة النتيجة */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <ProfileTitle title={examData?.title || t("examResult.title")} />

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* حالة النجاح أو الرسوب */}
          <span
            className={`font-semibold py-1 px-4 rounded-full flex items-center gap-1.5 ${
              isPassed
                ? "bg-green-50 text-green-700 border border-green-400"
                : "bg-red-50 text-red-700 border border-red-400"
            }`}
          >
            {isPassed ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>
              {isPassed ? t("examResult.passed") : t("examResult.failed")}
            </span>
          </span>

          <p className="font-medium py-1 px-4 text-amber-600 border border-amber-600 rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>
              {t("examResult.questions", { count: questionsList.length })}
            </span>
          </p>

          <p className="font-medium py-1 px-4 border rounded-full flex items-center gap-1.5">
            <span>
              {t("examResult.score", {
                score: examData?.score,
                total: examData?.full_mark,
              })}
            </span>
          </p>
        </div>
      </div>

      {/* محتوى الأسئلة */}
      <div className="space-y-6">
        <h3 className="text-gray-800 font-bold text-lg mb-4">
          {t("examResult.reviewAnswers")}
        </h3>

        <div className="space-y-4">
          {questionsList.map((q, qIndex) => (
            <div
              key={q.id}
              className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              {/* نص السؤال الحقيقي وعلامة بجانبه توضح إذا كان حله صح أم خطأ */}
              <div className="flex items-start gap-2">
                {q.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <p className="text-gray-900 font-medium text-base">
                  {qIndex + 1}- {q.title}
                </p>
              </div>

              {/* الخيارات الأربعة */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {q.options?.map((opt) => {
                  // هل هذا الخيار هو الذي اختاره الطالب؟
                  const isStudentSelection = q.student_option_id === opt.id;
                  // هل هذا الخيار هو الإجابة الصحيحة في السيرفر؟
                  const isCorrectAnswer =
                    opt.is_correct === true || opt.is_correct === 1;

                  // تحديد التنسيقات بناءً على الشروط الحقيقية للـ API
                  let optionStyle = "border-gray-200 bg-white text-gray-700";
                  let radioStyle = "border-gray-400";

                  if (isCorrectAnswer) {
                    // الخيار الصحيح دائماً يظهر بالأخضر (سواء اختاره الطالب أم لا)
                    optionStyle =
                      "border-green-400 bg-green-50 text-green-700 font-semibold";
                    radioStyle = "border-green-600 bg-green-600 text-white";
                  } else if (isStudentSelection && !isCorrectAnswer) {
                    // إذا اختاره الطالب وكان خطأ يظهر بالأحمر
                    optionStyle =
                      "border-red-400 bg-red-50 text-red-700 font-semibold";
                    radioStyle = "border-red-600 bg-red-600 text-white";
                  }

                  // جلب نص الخيار (يدعم وجود ترجمة ar أو en)
                  const optionText =
                    typeof opt.option === "object"
                      ? opt.option.ar || opt.option.en
                      : opt.option;

                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-2 border rounded-lg p-3 text-sm transition-all select-none ${optionStyle}`}
                    >
                      {/* نقطة الاختيار الداخلية للـ Radio Button */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] shrink-0 ${radioStyle}`}
                      >
                        {(isStudentSelection || isCorrectAnswer) && "●"}
                      </span>
                      <span className="flex-1 break-all wrap-break-word">
                        {optionText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
