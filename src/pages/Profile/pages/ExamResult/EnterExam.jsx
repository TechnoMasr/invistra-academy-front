import React, { useEffect, useState, useRef } from "react";
import { getExamsStudentQuestion, submitAnswer } from "@/api/ExamServices";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, useBlocker } from "react-router";
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
  const isSubmittedRef = useRef(false); // لمنع التكرار والإرسال المزدوج
  const selectedAnswersRef = useRef(selectedAnswers);

  // تحديث الـ Ref دائماً بالقيمة الحالية لاستخدامه داخل أحداث المتصفح المستقلة
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // 1. جلب بيانات الامتحان
  const { data: exam, isLoading } = useQuery({
    queryKey: ["examsStudentQuestion", id],
    queryFn: () => getExamsStudentQuestion(id),
  });

  // 2. تفعيل الـ Mutation الخاص بإرسال الإجابات
  const { mutate: submitExam, isPending: isSubmitting } = useMutation({
    mutationFn: (formData) => submitAnswer(formData, id),
    onSuccess: () => {
      isSubmittedRef.current = true;
      alert(t("enterExam.submitSuccess") || "تم إرسال الامتحان بنجاح");
      navigate(`/profile/exam-result/${id}`, { replace: true });
    },
    onError: (error) => {
      console.error(error);
      alert(t("enterExam.submitError") || "حدث خطأ أثناء إرسال الامتحان");
    },
  });

  // دالة مساعدة لتحويل الإجابات لـ FormData وإرسالها
  const sendAnswersAndSubmit = (currentAnswers) => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;

    const formData = new FormData();
    Object.entries(currentAnswers).forEach(([qId, optId], index) => {
      formData.append(`answers[${index}][question_id]`, qId);
      formData.append(`answers[${index}][option_id]`, optId);
    });
    submitExam(formData);
  };

  // 3. تفعيل وضع ملء الشاشة تلقائياً ومراقبته عند الخروج
  useEffect(() => {
    const element = document.documentElement;

    // تفعيل ملء الشاشة عند الدخول
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();

    // دالة لمراقبة الخروج من ملء الشاشة
    const handleFullscreenChange = () => {
      // إذا لم يعد هناك عنصر في وضع ملء الشاشة، والامتحان لم يتم إرساله بعد
      if (!document.fullscreenElement && !isSubmittedRef.current) {
        alert(
          t("enterExam.fullscreenExitWarning") ||
            "لقد خرجت من وضع ملء الشاشة! سيتم إنهاء الامتحان وإرسال إجاباتك الحالية فوراً.",
        );
        sendAnswersAndSubmit(selectedAnswersRef.current);
      }
    };

    // إضافة مستمعات الأحداث لجميع المتصفحات
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      // تنظيف الأحداث عند الخروج من الصفحة
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );

      // إلغاء ملء الشاشة إذا كان لا يزال مفعلاً
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.log(err));
      }
    };
  }, []);

  // 4. منع إغلاق المتصفح أو عمل Refresh (BeforeUnload)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isSubmittedRef.current) return;

      sendAnswersAndSubmit(selectedAnswersRef.current);

      e.preventDefault();
      e.returnValue =
        "هل أنت متأكد؟ خروجك يعني إنهاء الامتحان بالدرجة الحالية!";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 5. منع التنقل الداخلي في React Router
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      !isSubmittedRef.current &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmExit = window.confirm(
        "تحذير! إذا خرجت الآن سيتم إنهاء الامتحان وإرسال إجاباتك الحالية تلقائياً. هل تريد الاستمرار والخروج؟",
      );

      if (confirmExit) {
        sendAnswersAndSubmit(selectedAnswersRef.current);
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // التعامل مع اختيار الإجابة
  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // عند الضغط على زر الارسال اليدوي
  const handleSubmit = (e) => {
    e.preventDefault();
    sendAnswersAndSubmit(selectedAnswers);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const questionsList = exam?.questions || [];

  return (
    <main className="min-h-screen bg-gray-50 select-none p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* الهيدر العلوي للامتحان */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-white p-5 rounded-xl shadow-sm pb-4">
          <ProfileTitle title={exam?.title || t("enterExam.title")} />

          <div className="flex gap-3 text-sm">
            <p className="font-medium py-1 px-4 text-amber-500 border border-amber-500 rounded-full flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>
                {t("enterExam.questions", { count: questionsList.length })}
              </span>
            </p>
            <p className="font-medium py-1 px-4 border rounded-full flex items-center gap-1.5">
              <span>{t("enterExam.passMark", { mark: exam?.pass_mark })} </span>
            </p>
          </div>
        </div>

        {/* محتوى الأسئلة */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <h3 className="text-gray-800 font-bold text-lg mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {t("enterExam.chooseCorrect")}
          </h3>

          <div className="space-y-6">
            {questionsList.map((q, qIndex) => (
              <div
                key={q.id}
                className="space-y-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <p className="text-gray-900 font-medium text-base">
                  {qIndex + 1}- {q.title}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {q.options?.map((opt) => {
                    const isSelected = selectedAnswers[q.id] === opt.id;

                    const optionStyle = isSelected
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "bg-white cursor-pointer font-medium hover:bg-gray-50";

                    const radioStyle = isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-400";

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`flex items-center gap-2 border rounded-lg p-4 text-sm transition-all select-none ${optionStyle}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] shrink-0 ${radioStyle}`}
                        >
                          {isSelected && "●"}
                        </span>
                        <span className="flex-1 wrap-break-word break-all">
                          {opt.option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* زر الارسال */}
          <div className="pt-4 p-4 bg-white rounded-xl shadow-sm flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={
                isSubmitting || Object.keys(selectedAnswers).length === 0
              }
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {t("enterExam.submit")}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EnterExam;
