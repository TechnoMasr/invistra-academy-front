import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import {
  addExam,
  uploadExamFile,
  getInstructorCoursesForExams,
  getExamsTemplate,
} from "@/api/ExamServices";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { getLecturesInstructor } from "@/api/lectureServices";
import {
  Download,
  Upload,
  FileSpreadsheet,
  Check,
  FileUp,
} from "lucide-react";

const AddExam = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isDragging, setIsDragging] = useState(false);

  // 1. مخطط Zod مع التحقق الشرطي للـ dynamic mode
  const examSchema = z
    .object({
      creation_method: z.enum(["manual", "excel"]),
      exam_type: z.enum(["final", "lecture"], {
        required_error: t("addExam.validation.examTypeRequired"),
      }),
      course_id: z.string().min(1, t("addExam.validation.courseRequired")),
      lecture_id: z.string().optional(),
      file: z.any().optional(),

      // حقول اختيارية للـ Excel وإلزامية لليدوي
      exam_title_ar: z.string().optional(),
      exam_title_en: z.string().optional(),
      min_degree: z.any().optional(),
      max_degree: z.any().optional(),
      duration: z.any().optional(),
      displayed_questions_count: z.any().optional(),
      max_attempts: z.any().optional(),
      required_watch_percentage: z.any().optional(),
      questions: z.array(z.any()).optional(),
    })
    .superRefine((data, ctx) => {
      // تحقق مشترك: المحاضرة
      if (data.exam_type === "lecture" && !data.lecture_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.lectureRequired"),
          path: ["lecture_id"],
        });
      }

      // ---------------- حالة الـ EXCEL ----------------
      if (data.creation_method === "excel") {
        if (
          !data.file ||
          (data.file instanceof FileList && data.file.length === 0)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("addExam.validation.fileRequired"),
            path: ["file"],
          });
        }

        return;
      }

      // ---------------- حالة الـ MANUAL ----------------
      if (!data.exam_title_ar || data.exam_title_ar.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.nameArRequired"),
          path: ["exam_title_ar"],
        });
      }

      if (!data.exam_title_en || data.exam_title_en.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.nameEnRequired"),
          path: ["exam_title_en"],
        });
      }

      const minDeg = Number(data.min_degree);
      const maxDeg = Number(data.max_degree);
      const dur = Number(data.duration);
      const dispCount = Number(data.displayed_questions_count);
      const attempts = Number(data.max_attempts);

      if (isNaN(minDeg) || minDeg < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.passMarkRequired"),
          path: ["min_degree"],
        });
      }

      if (isNaN(maxDeg) || maxDeg < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.fullMarkRequired"),
          path: ["max_degree"],
        });
      }

      if (minDeg > maxDeg) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.minDegreeExceedsMax"),
          path: ["min_degree"],
        });
      }

      if (isNaN(dur) || dur < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.durationRequired"),
          path: ["duration"],
        });
      }

      if (isNaN(dispCount) || dispCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(
            "addExam.validation.displayedQuestionsCountRequired"
          ),
          path: ["displayed_questions_count"],
        });
      }

      if (isNaN(attempts) || attempts < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.attemptsAllowedRequired"),
          path: ["max_attempts"],
        });
      }

      if (data.exam_type === "final") {
        const watchPct = Number(data.required_watch_percentage);

        if (
          data.required_watch_percentage === "" ||
          isNaN(watchPct) ||
          watchPct < 1 ||
          watchPct > 100
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(
              "addExam.validation.minCompletionPercentageRequired"
            ),
            path: ["required_watch_percentage"],
          });
        }
      }

      if (!data.questions || data.questions.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.minQuestions"),
          path: ["questions"],
        });
      } else {
        if (dispCount > data.questions.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(
              "addExam.validation.displayedCountExceedsTotal"
            ),
            path: ["displayed_questions_count"],
          });
        }

        data.questions.forEach((q, qIndex) => {
          if (!q.question_title_ar || q.question_title_ar.length < 5) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("addExam.validation.questionArRequired"),
              path: ["questions", qIndex, "question_title_ar"],
            });
          }

          if (!q.question_title_en || q.question_title_en.length < 5) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("addExam.validation.questionEnRequired"),
              path: ["questions", qIndex, "question_title_en"],
            });
          }

          if (
            !q.options ||
            q.options.length < 2 ||
            q.options.length > 4
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("addExam.validation.minOptions"),
              path: ["questions", qIndex, "options"],
            });
          } else {
            q.options.forEach((opt, optIndex) => {
              if (!opt.option_ar) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("addExam.validation.optionArRequired"),
                  path: [
                    "questions",
                    qIndex,
                    "options",
                    optIndex,
                    "option_ar",
                  ],
                });
              }

              if (!opt.option_en) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("addExam.validation.optionEnRequired"),
                  path: [
                    "questions",
                    qIndex,
                    "options",
                    optIndex,
                    "option_en",
                  ],
                });
              }
            });
          }
        });
      }
    });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      creation_method: "manual",
      exam_type: "final",
      course_id: "",
      lecture_id: "",
      file: null,
      exam_title_ar: "",
      exam_title_en: "",
      min_degree: "",
      max_degree: "",
      duration: "",
      displayed_questions_count: "",
      max_attempts: "",
      required_watch_percentage: "",
      questions: [
        {
          question_title_ar: "",
          question_title_en: "",
          is_appears_to_all_examinees: false,
          options: [
            { option_ar: "", option_en: "" },
            { option_ar: "", option_en: "" },
          ],
        },
      ],
    },
  });

  const creationMethod = watch("creation_method");
  const selectedExamType = watch("exam_type");
  const selectedCourseId = watch("course_id");
  const selectedFile = watch("file");

  // جلب الكورسات
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["instructorCoursesForExams"],
    queryFn: getInstructorCoursesForExams,
  });

  // جلب المحاضرات بناءً على الكورس المحدد
  const { data: lectures, isLoading: isLoadingLectures } = useQuery({
    queryKey: ["instructorLectures", selectedCourseId],
    queryFn: () => getLecturesInstructor(selectedCourseId),
    enabled: !!selectedCourseId && selectedExamType === "lecture",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  // Mutation لإضافة الاختبار يدوياً
  const {
    mutate: createExamMutate,
    isPending: isPendingManual,
    error: manualError,
  } = useMutation({
    mutationFn: async ({ formData, courseId }) => {
      return await addExam(formData, courseId);
    },
    onSuccess: () => {
      toast.success(t("addExam.success"));
      reset();
      navigate(`/profile/exams`);
    },
  });

  // Mutation لرفع ملف Excel
  const {
    mutate: uploadExcelMutate,
    isPending: isPendingExcel,
    error: excelError,
  } = useMutation({
    mutationFn: async ({ formData, courseId }) => {
      return await uploadExamFile({ formData, courseId });
    },
    onSuccess: () => {
      toast.success(t("addExam.excelSuccess"));
      reset();
      navigate(`/profile/exams`);
    },
  });

  // Mutation لتنزيل الـ Template
  const {
    mutate: downloadTemplateMutate,
    isPending: isDownloadingTemplate,
  } = useMutation({
    mutationFn: getExamsTemplate,
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "exam_template.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(t("addExam.templateDownloaded"));
    },
    onError: () => {
      toast.error(t("addExam.templateDownloadError"));
    },
  });

  const isPending = isPendingManual || isPendingExcel;
  const error = manualError || excelError;

  // تغيير طريقة الإنشاء
  const handleCreationMethodChange = (method) => {
    setValue("creation_method", method, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("file", null);

    if (method === "excel") {
      setValue("questions", []);
    } else {
      setValue("questions", [
        {
          question_title_ar: "",
          question_title_en: "",
          is_appears_to_all_examinees: false,
          options: [
            { option_ar: "", option_en: "" },
            { option_ar: "", option_en: "" },
          ],
        },
      ]);
    }
  };

  // تغيير نوع الاختبار
  const handleExamTypeChange = (type) => {
    setValue("exam_type", type, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("lecture_id", "");
    setValue("required_watch_percentage", "");
  };

  // التعامل مع رفع الملف
  const handleFileChange = (file) => {
    if (!file) return;

    setValue("file", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDrop = (e, onChange) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    const isExcelFile =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isExcelFile) {
      toast.error(t("addExam.validation.fileType"));
      return;
    }

    onChange(file);
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // ---------------- في حالة رفع ملف EXCEL ----------------
    if (data.creation_method === "excel") {
      formData.append("exam_type", data.exam_type);

      if (data.exam_type === "lecture") {
        formData.append("lecture_id", data.lecture_id);
      }

      const fileObj =
        data.file instanceof FileList ? data.file[0] : data.file;

      formData.append("file", fileObj);

      uploadExcelMutate({
        formData,
        courseId: data.course_id,
      });

      return;
    }

    // ---------------- في حالة الإدخال اليدوي ----------------
    formData.append("exam_type", data.exam_type);

    if (data.exam_type === "lecture") {
      formData.append("lecture_id", data.lecture_id);
    } else {
      formData.append(
        "required_watch_percentage",
        String(data.required_watch_percentage)
      );
    }

    formData.append("title[en]", data.exam_title_en);
    formData.append("title[ar]", data.exam_title_ar);

    formData.append("pass_mark", String(data.min_degree));
    formData.append("full_mark", String(data.max_degree));
    formData.append("duration", String(data.duration));

    formData.append(
      "displayed_questions_count",
      String(data.displayed_questions_count)
    );

    formData.append("max_attempts", String(data.max_attempts));

    data.questions.forEach((q, qIndex) => {
      formData.append(
        `questions[${qIndex}][title][en]`,
        q.question_title_en
      );

      formData.append(
        `questions[${qIndex}][title][ar]`,
        q.question_title_ar
      );

      const isAppearsValue = q.is_appears_to_all_examinees
        ? "1"
        : "0";

      formData.append(
        `questions[${qIndex}][is_appears_to_all_examinees]`,
        isAppearsValue
      );

      q.options.forEach((opt, optIndex) => {
        formData.append(
          `questions[${qIndex}][options][${optIndex}][option][en]`,
          opt.option_en
        );

        formData.append(
          `questions[${qIndex}][options][${optIndex}][option][ar]`,
          opt.option_ar
        );
      });
    });

    createExamMutate({
      formData,
      courseId: data.course_id,
    });
  };

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("addExam.title")} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {/* ================= طريقة إضافة الأسئلة ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">
              {t("addExam.creationMethod")}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {t("addExam.creationMethodHint")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Manual Tab */}
            <button
              type="button"
              onClick={() =>
                handleCreationMethodChange("manual")
              }
              className={`group relative flex items-center gap-3 rounded-xl border p-4 text-start transition-all duration-200 cursor-pointer ${
                creationMethod === "manual"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                  creationMethod === "manual"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <FileUp className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    creationMethod === "manual"
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                >
                  {t("addExam.methodManual")}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {t("addExam.methodManualHint")}
                </p>
              </div>

              {creationMethod === "manual" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </button>

            {/* Excel Tab */}
            <button
              type="button"
              onClick={() =>
                handleCreationMethodChange("excel")
              }
              className={`group relative flex items-center gap-3 rounded-xl border p-4 text-start transition-all duration-200 cursor-pointer ${
                creationMethod === "excel"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                  creationMethod === "excel"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <FileSpreadsheet className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    creationMethod === "excel"
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                >
                  {t("addExam.methodExcel")}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {t("addExam.methodExcelHint")}
                </p>
              </div>

              {creationMethod === "excel" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ================= نوع الاختبار والكورس والمحاضرة ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          {/* نوع الاختبار Tabs */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {t("addExam.examType")}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() =>
                  handleExamTypeChange("final")
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 cursor-pointer ${
                  selectedExamType === "final"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {selectedExamType === "final" && (
                  <Check className="h-4 w-4" />
                )}

                {t("addExam.typeFinal")}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExamTypeChange("lecture")
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 cursor-pointer ${
                  selectedExamType === "lecture"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {selectedExamType === "lecture" && (
                  <Check className="h-4 w-4" />
                )}

                {t("addExam.typeLecture")}
              </button>
            </div>

            {errors.exam_type?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.exam_type.message}
              </p>
            )}
          </div>

          {/* الكورس */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="course_id"
              control={control}
              render={({ field }) => (
                <MainInput
                  {...field}
                  type="select"
                  label={t("addExam.course")}
                  placeholder={t("addExam.coursePlaceholder")}
                  disabled={isLoadingCourses}
                  options={
                    !isLoadingCourses && courses
                      ? courses.map((course) => ({
                          label: course.name,
                          value: String(course.id),
                        }))
                      : []
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("lecture_id", "");
                  }}
                  error={errors.course_id?.message}
                />
              )}
            />

            {/* المحاضرة */}
            {selectedExamType === "lecture" && (
              <Controller
                name="lecture_id"
                control={control}
                render={({ field }) => (
                  <MainInput
                    {...field}
                    type="select"
                    label={t("addExam.lecture")}
                    placeholder={
                      !selectedCourseId
                        ? t("addExam.selectCourseFirst")
                        : t("addExam.lecturePlaceholder")
                    }
                    disabled={
                      !selectedCourseId || isLoadingLectures
                    }
                    options={
                      !isLoadingLectures && lectures
                        ? lectures.map((lecture) => ({
                            label: `${lecture.index} - ${lecture.title}`,
                            value: String(lecture.id),
                          }))
                        : []
                    }
                    error={errors.lecture_id?.message}
                  />
                )}
              />
            )}
          </div>
        </div>

        {/* ================= واجهة رفع ملف EXCEL ================= */}
        {creationMethod === "excel" ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {/* تحميل Template */}
            <div className="mb-5 flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    {t("addExam.downloadTemplateTitle")}
                  </span>

                  <span className="mt-1 text-xs leading-5 text-gray-500">
                    {t("addExam.downloadTemplateDesc")}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => downloadTemplateMutate()}
                disabled={isDownloadingTemplate}
                className="flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 cursor-pointer whitespace-nowrap"
              >
                <Download className="h-4 w-4" />

                {isDownloadingTemplate
                  ? t("addExam.downloading")
                  : t("addExam.downloadTemplateBtn")}
              </Button>
            </div>

            {/* Drop Area */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">
                {t("addExam.uploadExcelLabel")}
              </label>

              <Controller
                name="file"
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <>
                    <input
                      ref={ref}
                      id="excel-file-input"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          handleFileChange(file);
                          onChange(file);
                        }
                      }}
                    />

                    <label
                      htmlFor="excel-file-input"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        handleDrop(e, (file) => {
                          onChange(file);
                        });
                      }}
                      className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.01]"
                          : selectedFile
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {selectedFile ? (
                        <>
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <FileSpreadsheet className="h-8 w-8" />
                          </div>

                          <h4 className="max-w-full truncate px-4 text-sm font-bold text-gray-800">
                            {selectedFile.name}
                          </h4>

                          <p className="mt-1 text-xs text-gray-500">
                            {(
                              selectedFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                            <Check className="h-3.5 w-3.5" />
                            {t("addExam.fileSelected")}
                          </div>

                          <p className="mt-3 text-xs font-medium text-primary">
                            {t("addExam.changeFile")}
                          </p>
                        </>
                      ) : (
                        <>
                          <div
                            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                              isDragging
                                ? "bg-primary text-white"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <Upload className="h-8 w-8" />
                          </div>

                          <h4 className="text-sm font-bold text-gray-800">
                            {t("addExam.dropFileTitle")}
                          </h4>

                          <p className="mt-2 text-xs text-gray-500">
                            {t("addExam.dropFileDescription")}
                          </p>

                          <span className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm border border-gray-100">
                            {t("addExam.chooseFile")}
                          </span>

                          <p className="mt-3 text-[11px] text-gray-400">
                            {t("addExam.allowedFileTypes")}
                          </p>
                        </>
                      )}
                    </label>
                  </>
                )}
              />

              {errors.file && (
                <span className="text-xs font-medium text-red-500">
                  {errors.file.message}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ================= واجهة الإدخال اليدوي ================= */
          <>
            {/* تفاصيل الاختبار */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="exam_title_ar"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label={t("addExam.nameAr")}
                      placeholder={t("addExam.nameArPlaceholder")}
                      error={errors.exam_title_ar?.message}
                    />
                  )}
                />

                <Controller
                  name="exam_title_en"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label={t("addExam.nameEn")}
                      placeholder={t("addExam.nameEnPlaceholder")}
                      error={errors.exam_title_en?.message}
                    />
                  )}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="max_degree"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="number"
                      label={t("addExam.fullMark")}
                      placeholder={t("addExam.fullMarkPlaceholder")}
                      error={errors.max_degree?.message}
                    />
                  )}
                />

                <Controller
                  name="min_degree"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="number"
                      label={t("addExam.passMark")}
                      placeholder={t("addExam.passMarkPlaceholder")}
                      error={errors.min_degree?.message}
                    />
                  )}
                />

                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="number"
                      label={t("addExam.duration")}
                      placeholder={t("addExam.durationPlaceholder")}
                      error={errors.duration?.message}
                    />
                  )}
                />

                <Controller
                  name="displayed_questions_count"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="number"
                      label={t("addExam.displayedQuestionsCount")}
                      placeholder={t(
                        "addExam.displayedQuestionsCountPlaceholder"
                      )}
                      error={
                        errors.displayed_questions_count?.message
                      }
                    />
                  )}
                />

                <Controller
                  name="max_attempts"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="number"
                      label={t("addExam.attemptsAllowed")}
                      placeholder={t(
                        "addExam.attemptsAllowedPlaceholder"
                      )}
                      error={errors.max_attempts?.message}
                    />
                  )}
                />

                {selectedExamType === "final" && (
                  <Controller
                    name="required_watch_percentage"
                    control={control}
                    render={({ field }) => (
                      <MainInput
                        {...field}
                        type="number"
                        label={t(
                          "addExam.minCompletionPercentage"
                        )}
                        placeholder={t(
                          "addExam.minCompletionPercentagePlaceholder"
                        )}
                        error={
                          errors.required_watch_percentage?.message
                        }
                      />
                    )}
                  />
                )}
              </div>
            </div>

            {/* بنك الأسئلة */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-5 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {t("addExam.questionsBank")}
                </h3>

                <span className="mt-1 block text-xs font-medium text-orange-500">
                  {t("addExam.questionsBankHint")}
                </span>
              </div>

              {questionFields.map((item, index) => (
                <QuestionFieldsGroup
                  key={item.id}
                  questionIndex={index}
                  control={control}
                  errors={errors}
                  removeQuestion={removeQuestion}
                  totalQuestions={questionFields.length}
                />
              ))}

              <button
                type="button"
                onClick={() =>
                  appendQuestion({
                    question_title_ar: "",
                    question_title_en: "",
                    is_appears_to_all_examinees: false,
                    options: [
                      { option_ar: "", option_en: "" },
                      { option_ar: "", option_en: "" },
                    ],
                  })
                }
                className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-gray-50 cursor-pointer"
              >
                {t("addExam.addQuestion")}
              </button>
            </div>
          </>
        )}

        {/* زر الحفظ وملاحظات الخطأ */}
        <div className="mt-2 flex flex-col items-center gap-3">
          <Button
            type="submit"
            className="w-full md:w-60 rounded-full"
            disabled={isPending}
          >
            {isPending
              ? t("addExam.saving")
              : t("addExam.save")}
          </Button>

          {error && (
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                t("addExam.error")
              }
            />
          )}
        </div>
      </form>
    </div>
  );
};

const QuestionFieldsGroup = ({
  questionIndex,
  control,
  errors,
  removeQuestion,
  totalQuestions,
}) => {
  const { t } = useTranslation();

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="relative mb-6 flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-6">
      {totalQuestions > 1 && (
        <button
          type="button"
          onClick={() => removeQuestion(questionIndex)}
          className="ms-auto cursor-pointer text-sm font-medium text-red-500 transition-all hover:text-red-700 hover:underline"
        >
          {t("addExam.deleteQuestion")}
        </button>
      )}

      <div className="flex flex-col justify-between gap-2 border-b pb-3 md:flex-row md:items-center">
        <h4 className="text-sm font-bold text-primary">
          {t("addExam.questionNumber", {
            number: questionIndex + 1,
          })}
        </h4>

        <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold text-gray-700">
          <Controller
            name={`questions.${questionIndex}.is_appears_to_all_examinees`}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <input
                {...field}
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  onChange(e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            )}
          />

          {t("addExam.isAppearsToAllExaminees")}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`questions.${questionIndex}.question_title_ar`}
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="textarea"
              label={t("addExam.questionAr")}
              placeholder={t(
                "addExam.questionArPlaceholder"
              )}
              error={
                errors.questions?.[questionIndex]
                  ?.question_title_ar?.message
              }
            />
          )}
        />

        <Controller
          name={`questions.${questionIndex}.question_title_en`}
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="textarea"
              label={t("addExam.questionEn")}
              placeholder={t(
                "addExam.questionEnPlaceholder"
              )}
              error={
                errors.questions?.[questionIndex]
                  ?.question_title_en?.message
              }
            />
          )}
        />
      </div>

      <div className="mt-2 space-y-4 border-t pt-4">
        <h5 className="text-xs font-bold text-gray-700">
          {t("addExam.answerOptions")}
        </h5>

        {optionFields.map((optItem, optIndex) => (
          <div
            key={optItem.id}
            className="relative flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                {t("addExam.optionNumber", {
                  number: optIndex + 1,
                })}{" "}
                {optIndex === 0 && (
                  <span className="text-green-600">
                    {t("addExam.correctAnswer")}
                  </span>
                )}
              </span>

              {optionFields.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(optIndex)}
                  className="cursor-pointer text-xs font-medium text-red-500 transition-all hover:text-red-700 hover:underline"
                >
                  {t("addExam.deleteOption")}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name={`questions.${questionIndex}.options.${optIndex}.option_ar`}
                control={control}
                render={({ field }) => (
                  <MainInput
                    {...field}
                    label={t("addExam.optionAr")}
                    placeholder={t(
                      "addExam.optionArPlaceholder"
                    )}
                    error={
                      errors.questions?.[questionIndex]
                        ?.options?.[optIndex]?.option_ar
                        ?.message
                    }
                  />
                )}
              />

              <Controller
                name={`questions.${questionIndex}.options.${optIndex}.option_en`}
                control={control}
                render={({ field }) => (
                  <MainInput
                    {...field}
                    label={t("addExam.optionEn")}
                    placeholder={t(
                      "addExam.optionEnPlaceholder"
                    )}
                    error={
                      errors.questions?.[questionIndex]
                        ?.options?.[optIndex]?.option_en
                        ?.message
                    }
                  />
                )}
              />
            </div>
          </div>
        ))}

        {optionFields.length < 4 && (
          <button
            type="button"
            onClick={() =>
              appendOption({
                option_ar: "",
                option_en: "",
              })
            }
            className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {t("addExam.addOption")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddExam;