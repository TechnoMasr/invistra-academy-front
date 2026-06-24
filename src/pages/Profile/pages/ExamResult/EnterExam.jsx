import React, { useEffect, useState, useRef } from "react";
import { getExamsStudentQuestion, submitAnswer } from "@/api/ExamServices";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, useBlocker } from "react-router";
import ProfileTitle from "@/components/common/ProfileTitle";
import { HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { RiTimerLine } from "react-icons/ri";
import LoadingPage from "@/components/Loading/LoadingPage";

const EnterExam = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // تخزين الإجابات المختارة: { [questionId]: optionId }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const isSubmittedRef = useRef(false); // لمنع التكرار والإرسال المزدوج
  const selectedAnswersRef = useRef(selectedAnswers);
  // حالة التايمر بالثواني والوقت الكلي للحسابات الدائرية
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);

  // تحديث الـ Ref دائماً بالقيمة الحالية لاستخدامه داخل أحداث المتصفح المستقلة والتايمر
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

  const questionsRef = useRef([]);

  // حدّثه لما الـ exam يتحمل
  useEffect(() => {
    if (exam?.questions) {
      questionsRef.current = exam.questions;
    }
  }, [exam]);

  // دالة مساعدة لتحويل الإجابات لـ FormData وإرسالها
  const sendAnswersAndSubmit = (currentAnswers) => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;

    const formData = new FormData();
    const questions = questionsRef.current; // ✅ دايماً محدّث

    questions.forEach((q, index) => {
      formData.append(`answers[${index}][question_id]`, q.id);
      formData.append(
        `answers[${index}][option_id]`,
        currentAnswers[q.id] ?? "",
      );
    });

    submitExam(formData);
  };

  // 2. إعداد وتشغيل التايمر التنازلي
  useEffect(() => {
    if (exam?.duration) {
      const seconds = exam.duration * 60;
      setTimeLeft(seconds);
      setTotalDuration(seconds); // حفظ الوقت الكلي لحساب النسبة الدائرية والألوان
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft === null) return;

    // إذا انتهى الوقت، أرسل الإجابات فوراً
    if (timeLeft <= 0) {
      alert(
        t("enterExam.timeOut") ||
          "انتهى وقت الامتحان! سيتم حفظ وإرسال إجاباتك الحالية تلقائيًا.",
      );
      sendAnswersAndSubmit(selectedAnswersRef.current);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // دالة تحويل الثواني إلى صيغة HH:MM:SS بشكل احترافي
  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // 3. تفعيل وضع ملء الشاشة تلقائياً ومراقبته عند الخروج
  useEffect(() => {
    const element = document.documentElement;

    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmittedRef.current) {
        alert(
          t("enterExam.fullscreenExitWarning") ||
            "لقد خرجت من وضع ملء الشاشة! سيتم إنهاء الامتحان وإرسال إجاباتك الحالية فوراً.",
        );
        sendAnswersAndSubmit(selectedAnswersRef.current);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
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

  if (isLoading) return <LoadingPage />;

  const questionsList = exam?.questions || [];

  // --- حسابات الـ Progress Circle الديناميكية بالأثلاث ---
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  // حساب نسبة الوقت المتبقي (من 0 إلى 100)
  const percentageLeft = totalDuration ? (timeLeft / totalDuration) * 100 : 0;

  // حساب المسافة المقطوعة للدائرة
  const strokeDashoffset =
    circumference - (percentageLeft / 100) * circumference;

  // تحديد كلاسات الألوان ديناميكياً بناءً على نسبة الوقت المتبقي
  let timerColorClass = "text-sky-500"; // الافتراضي: الثلث الأول (الأزرق)
  let timerBgClass = "border-gray-100 bg-white";
  let textClockColorClass = "text-gray-700";

  if (percentageLeft <= 33.33) {
    // الثلث الأخير (الأحمر)
    timerColorClass = "text-red-500 animate-pulse";
    timerBgClass = "border-red-200 bg-red-50/50";
    textClockColorClass = "text-red-600 animate-pulse";
  } else if (percentageLeft <= 66.66) {
    // الثلث الأوسط (الأصفر)
    timerColorClass = "text-amber-500";
    timerBgClass = "border-amber-200 bg-amber-50/50";
    textClockColorClass = "text-amber-600";
  }

  return (
    <main className="min-h-screen bg-gray-50 select-none p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* الهيدر العلوي للامتحان */}
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-4 border-b bg-white p-5 rounded-xl shadow-sm">
          <ProfileTitle title={exam?.title} />

          {/* التايمر الدائري المتغير ديناميكياً حسب النسبة المئوية */}
          {timeLeft !== null && (
            <div
              className={`flex items-center gap-3 border rounded-xl py-1.5 px-4 shadow-sm transition-all duration-500 ${timerBgClass}`}
            >
              {/* رسمة الـ SVG للدائرة */}
              <div className="relative flex items-center justify-center w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  {/* الدائرة الخلفية الرمادية */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* الدائرة الملونة المتحركة ديناميكياً */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className={`transition-all duration-1000 ease-linear ${timerColorClass}`}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                {/* الأيقونة في المنتصف وتتغير ألوانها أيضاً */}
                <div
                  className={`absolute text-xs ${percentageLeft <= 33.33 ? "animate-ping text-red-500" : ""}`}
                >
                  <RiTimerLine className="w-6 h-6" />
                </div>
              </div>

              {/* الوقت بالأرقام بجانب الدائرة */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">
                  الوقت المتبقي
                </span>
                <span
                  className={`font-mono text-base font-bold transition-colors duration-500 ${textClockColorClass}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* محتوى الأسئلة */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-gray-800 font-bold text-lg">
              {t("enterExam.chooseCorrect")}
            </h3>

            <div className="flex flex-wrap gap-3 text-sm items-center">
              <p className="font-medium py-1 px-4 text-amber-500 border border-amber-500 rounded-full flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>
                  {t("enterExam.questions", { count: questionsList.length })}
                </span>
              </p>
              <p className="font-medium py-1 px-4 border rounded-full flex items-center gap-1.5">
                <span>
                  {t("enterExam.passMark", { mark: exam?.pass_mark })}{" "}
                </span>
              </p>
            </div>
          </div>

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
