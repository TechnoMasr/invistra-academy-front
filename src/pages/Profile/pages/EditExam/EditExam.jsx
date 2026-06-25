import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import { getExamDetailsInstructor, updateExam } from "@/api/ExamServices";
import LoadingPage from "@/components/Loading/LoadingPage";

const EditExam = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // 1. تحديث الـ Schema وإضافة شروط التحقق المتبادلة (superRefine)
  const examSchema = z
    .object({
      exam_title_ar: z.string().min(3, t("addExam.validation.nameArRequired")),
      exam_title_en: z.string().min(3, t("addExam.validation.nameEnRequired")),
      min_degree: z.preprocess(
        (val) => Number(val),
        z.number().min(1, t("addExam.validation.passMarkRequired")),
      ),
      max_degree: z.preprocess(
        (val) => Number(val),
        z.number().min(1, t("addExam.validation.fullMarkRequired")),
      ),
      duration: z.preprocess(
        (val) => Number(val),
        z.number().min(1, t("addExam.validation.durationRequired")),
      ),
      displayed_questions_count: z.preprocess(
        (val) => Number(val),
        z
          .number()
          .min(1, t("addExam.validation.displayedQuestionsCountRequired")),
      ),
      max_attempts: z.preprocess(
        (val) => Number(val),
        z.number().min(1, t("addExam.validation.attemptsAllowedRequired")),
      ),
      required_watch_percentage: z.preprocess(
        (val) => Number(val),
        z
          .number()
          .min(1, t("addExam.validation.minCompletionPercentageRequired"))
          .max(100, t("addExam.validation.minCompletionPercentageMax")),
      ),

      questions: z
        .array(
          z.object({
            question_title_ar: z
              .string()
              .min(5, t("addExam.validation.questionArRequired")),
            question_title_en: z
              .string()
              .min(5, t("addExam.validation.questionEnRequired")),
            is_appears_to_all_examinees: z.boolean().default(false),
            options: z
              .array(
                z.object({
                  option_ar: z
                    .string()
                    .min(1, t("addExam.validation.optionArRequired")),
                  option_en: z
                    .string()
                    .min(1, t("addExam.validation.optionEnRequired")),
                }),
              )
              .min(2, t("addExam.validation.minOptions"))
              .max(4, t("addExam.validation.maxOptions")),
          }),
        )
        .min(1, t("addExam.validation.minQuestions")),
    })
    .superRefine((data, ctx) => {
      // الشرط الأول: الحد الأدنى للنجاح لا يتعدى الدرجة النهائية
      if (data.min_degree > data.max_degree) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.minDegreeExceedsMax"),
          path: ["min_degree"],
        });
      }

      // الشرط الثاني: عدد الأسئلة المعروضة لا يتعدى إجمالي الأسئلة المتاحة في البنك
      if (data.displayed_questions_count > data.questions.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("addExam.validation.displayedCountExceedsTotal"),
          path: ["displayed_questions_count"],
        });
      }
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      exam_title_ar: "",
      exam_title_en: "",
      min_degree: "",
      max_degree: "",
      duration: "",
      displayed_questions_count: "",
      max_attempts: "",
      required_watch_percentage: "",

      questions: [],
    },
  });

  const { data: examDetails, isLoading: isExamLoading } = useQuery({
    queryKey: ["examDetails", id],
    queryFn: () => getExamDetailsInstructor(id),
    enabled: !!id,
  });

  const getFormattedExamData = (details) => {
    if (!details) return {};
    return {
      exam_title_ar: details.title?.ar || "",
      exam_title_en: details.title?.en || "",
      min_degree: details.pass_mark || "",
      max_degree: details.full_mark || "",
      duration: details.duration || "",
      displayed_questions_count: details.displayed_questions_count || "",
      max_attempts: details.max_attempts || "",
      required_watch_percentage: details.required_watch_percentage || "",

      questions: (details.questions || []).map((q) => ({
        question_title_ar: q.title?.ar || "",
        question_title_en: q.title?.en || "",
        is_appears_to_all_examinees: Boolean(
          Number(q.is_appears_to_all_examinees),
        ),
        options: (q.options || []).map((opt) => ({
          option_ar: opt.option?.ar || "",
          option_en: opt.option?.en || "",
        })),
      })),
    };
  };

  useEffect(() => {
    if (examDetails) {
      reset(getFormattedExamData(examDetails));
    }
  }, [examDetails, reset]);

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const {
    mutate: updateExamMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      return await updateExam(formData, id);
    },
    onSuccess: () => {
      toast.success(t("editExam.success"));
      setIsEditing(false);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title[en]", data.exam_title_en);
    formData.append("title[ar]", data.exam_title_ar);
    formData.append("pass_mark", String(data.min_degree));
    formData.append("full_mark", String(data.max_degree));
    formData.append("duration", String(data.duration));
    formData.append(
      "displayed_questions_count",
      String(data.displayed_questions_count),
    );
    formData.append("max_attempts", String(data.max_attempts));
    formData.append(
      "required_watch_percentage",
      String(data.required_watch_percentage),
    );

    data.questions.forEach((q, qIndex) => {
      formData.append(`questions[${qIndex}][title][en]`, q.question_title_en);
      formData.append(`questions[${qIndex}][title][ar]`, q.question_title_ar);

      const isAppearsValue = q.is_appears_to_all_examinees ? "1" : "0";
      formData.append(
        `questions[${qIndex}][is_appears_to_all_examinees]`,
        isAppearsValue,
      );

      q.options.forEach((opt, optIndex) => {
        formData.append(
          `questions[${qIndex}][options][${optIndex}][option][en]`,
          opt.option_en,
        );
        formData.append(
          `questions[${qIndex}][options][${optIndex}][option][ar]`,
          opt.option_ar,
        );
      });
    });

    updateExamMutate(formData);
  };

  if (isExamLoading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title={t("editExam.title")} />

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-medium py-1.5 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm hover:bg-primary/5 transition-all"
          >
            <FaRegEdit className="w-4 h-4" />
            <span>{t("editExam.editData")}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="exam_title_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                disabled={!isEditing}
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
                disabled={!isEditing}
                label={t("addExam.nameEn")}
                placeholder={t("addExam.nameEnPlaceholder")}
                error={errors.exam_title_en?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="max_degree"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="number"
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
                label={t("addExam.displayedQuestionsCount")}
                placeholder={t("addExam.displayedQuestionsCountPlaceholder")}
                error={errors.displayed_questions_count?.message}
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
                disabled={!isEditing}
                label={t("addExam.attemptsAllowed")}
                placeholder={t("addExam.attemptsAllowedPlaceholder")}
                error={errors.max_attempts?.message}
              />
            )}
          />
          <Controller
            name="required_watch_percentage"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="number"
                disabled={!isEditing} // شيلها في AddExam
                label={t("addExam.minCompletionPercentage")}
                placeholder={t("addExam.minCompletionPercentagePlaceholder")}
                error={errors.required_watch_percentage?.message}
              />
            )}
          />
        </div>

        <div className="border-t pt-6 mt-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {t("addExam.questionsBank")}
            </h3>
            <span className="text-xs text-orange-500 font-medium">
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
              isEditing={isEditing}
            />
          ))}

          {isEditing && (
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
              className="flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full hover:bg-gray-50 transition-all mt-2"
            >
              <span className="text-lg">+</span> {t("addExam.addQuestion")}
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Button
              type="submit"
              className="w-full md:w-60 rounded-full"
              disabled={isPending}
            >
              {isPending ? t("editExam.saving") : t("editExam.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40 rounded-full"
              onClick={() => {
                if (examDetails) {
                  reset(getFormattedExamData(examDetails));
                }
                setIsEditing(false);
              }}
            >
              {t("editExam.cancel")}
            </Button>
          </div>
        )}

        {error && (
          <div className="flex justify-center mt-4">
            <FormError
              errorMsg={error?.response?.data?.message || t("addExam.error")}
            />
          </div>
        )}
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
  isEditing,
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
    <div className="p-6 bg-gray-50/60 border border-gray-100 rounded-xl mb-6 flex flex-col gap-4 relative">
      {totalQuestions > 1 && isEditing && (
        <button
          type="button"
          onClick={() => removeQuestion(questionIndex)}
          className="absolute top-3 inset-e-4 text-sm text-red-500 hover:text-red-700 font-medium hover:underline transition-all"
        >
          {t("addExam.deleteQuestion")}
        </button>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-2">
        <h4 className="text-sm font-bold text-primary">
          {t("addExam.questionNumber", { number: questionIndex + 1 })}
        </h4>

        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
          <Controller
            name={`questions.${questionIndex}.is_appears_to_all_examinees`}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <input
                {...field}
                type="checkbox"
                disabled={!isEditing}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
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
              disabled={!isEditing}
              label={t("addExam.questionAr")}
              placeholder={t("addExam.questionArPlaceholder")}
              error={
                errors.questions?.[questionIndex]?.question_title_ar?.message
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
              disabled={!isEditing}
              label={t("addExam.questionEn")}
              placeholder={t("addExam.questionEnPlaceholder")}
              error={
                errors.questions?.[questionIndex]?.question_title_en?.message
              }
            />
          )}
        />
      </div>

      <div className="space-y-4 border-t pt-4 mt-2">
        <h5 className="text-xs font-bold text-gray-700">
          {t("addExam.answerOptions")}
        </h5>

        {optionFields.map((optItem, optIndex) => (
          <div
            key={optItem.id}
            className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-gray-100 relative"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-semibold">
                {t("addExam.optionNumber", { number: optIndex + 1 })}{" "}
                {optIndex === 0 && (
                  <span className="text-green-600">
                    {t("addExam.correctAnswer")}
                  </span>
                )}
              </span>
              {optionFields.length > 2 && isEditing && (
                <button
                  type="button"
                  onClick={() => removeOption(optIndex)}
                  className="text-xs text-red-400 hover:text-red-600"
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
                    disabled={!isEditing}
                    label={t("addExam.optionAr")}
                    placeholder={t("addExam.optionArPlaceholder")}
                    error={
                      errors.questions?.[questionIndex]?.options?.[optIndex]
                        ?.option_ar?.message
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
                    disabled={!isEditing}
                    label={t("addExam.optionEn")}
                    placeholder={t("addExam.optionEnPlaceholder")}
                    error={
                      errors.questions?.[questionIndex]?.options?.[optIndex]
                        ?.option_en?.message
                    }
                  />
                )}
              />
            </div>
          </div>
        ))}

        {optionFields.length < 4 && isEditing && (
          <button
            type="button"
            onClick={() => appendOption({ option_ar: "", option_en: "" })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
          >
            {t("addExam.addOption")}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditExam;
