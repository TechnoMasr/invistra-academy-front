import { getExamsStudentQuestion, submitAnswer } from "@/api/ExamServices"; // تأكد من الحروف السبلنج للـ folder إذا كان Services
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import ProfileTitle from "@/components/common/ProfileTitle";
import { HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const EnterExam = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // تخزين الإجابات المختارة: { [questionId]: optionId }
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // 1. جلب بيانات الامتحان
  const { data: exam, isLoading } = useQuery({
    queryKey: ["examsStudentQuestion", id],
    queryFn: () => getExamsStudentQuestion(id),
  });

  // 2. تفعيل الـ Mutation الخاص بإرسال الإجابات
  const { mutate: submitExam, isPending: isSubmitting } = useMutation({
    mutationFn: (formData) => submitAnswer(formData, id),
    onSuccess: () => {
      alert(t("enterExam.submitSuccess"));
      navigate(`/profile/exam-result/${id}`);
    },
    onError: (error) => {
      console.error(error);
      alert(t("enterExam.submitError"));
    },
  });

  // التعامل مع اختيار الإجابة
  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // عند الضغط على زر الارسال (تحويل البيانات لشكل الصورة)
  const handleSubmit = (e) => {
    e.preventDefault();

    // إنشاء كائن FormData جديد
    const formData = new FormData();

    // تحويل الـ selectedAnswers إلى مصفوفة وتعبئتها في الـ FormData بنفس الصيغة المطلوبة
    Object.entries(selectedAnswers).forEach(([qId, optId], index) => {
      formData.append(`answers[${index}][question_id]`, qId);
      formData.append(`answers[${index}][option_id]`, optId);
    });

    // إرسال الـ FormData إلى السيرفر
    submitExam(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const questionsList = exam?.questions || [];

  return (
    <div className="space-y-6">
      {/* الهيدر العلوي */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
        <ProfileTitle title={exam?.title || t("enterExam.title")} />

        <div className="flex gap-3 text-sm">
          <p className="font-medium py-1 px-4 text-amber-500 border border-amber-500 rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>{questionsList.length} {t("enterExam.questions")}</span>
          </p>
          <p className="font-medium py-1 px-4 text-gray-600 border rounded-full flex items-center gap-1.5">
            <span>{t("enterExam.passMark")}: {exam?.pass_mark}</span>
          </p>
        </div>
      </div>

      {/* محتوى الأسئلة */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <h3 className="text-gray-800 font-bold text-lg mb-4">
          {t("enterExam.chooseCorrect")}
        </h3>

        <div className="space-y-6">
          {questionsList.map((q, qIndex) => (
            <div
              key={q.id}
              className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              {/* نص السؤال الحقيقي من الـ API */}
              <p className="text-gray-900 font-medium text-base">
                {qIndex + 1}- {q.title}
              </p>

              {/* الخيارات الأربعة */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {q.options?.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;

                  // ستايل الخيار أثناء الحل (تحديد أزرق خفيف عند الاختيار)
                  const optionStyle = isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "bg-white cursor-pointer font-medium";

                  const radioStyle = isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-gray-400";

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`flex items-center gap-2 border rounded-lg p-3 text-sm transition-all select-none ${optionStyle}`}
                    >
                      {/* شكل الـ Radio Button */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] shrink-0 ${radioStyle}`}
                      >
                        {isSelected && "●"}
                      </span>
                      <span className="flex-1 wrap-break-word break-all">{opt.option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* زرار الـ Submit */}
        <div className="pt-4 border-t flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("enterExam.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnterExam;
