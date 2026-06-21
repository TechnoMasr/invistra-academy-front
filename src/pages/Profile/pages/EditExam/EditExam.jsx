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
import {
  getExamDetailsInstructor,
  updateExam,
  getInstructorCoursesForExams,
} from "@/api/ExamServices";
import InputsSkeleton from "@/components/Loading/SkeletonLoading/InputsSkeleton";

const EditExam = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // جلب معرف الامتحان من الـ URL
  const [isEditing, setIsEditing] = useState(false);


  // 1. بناء الـ Schema الديناميكي المتوافق مع حقل العرض وخيار تثبيت السؤال الجديد
  const examSchema = z.object({
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
    displayed_questions_count: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(1, t("addExam.validation.displayedQuestionsCountRequired")),
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
  });

  // 2. إعداد الـ Form بالقيم الافتراضية المبدئية
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
      displayed_questions_count: "",
      questions: [],
    },
  });

  // 3. جلب تفاصيل الامتحان الحالي وتحويل شكل البيانات ليتناسب مع الـ Form
  const { data: examDetails, isLoading: isExamLoading } = useQuery({
    queryKey: ["examDetails", id],
    queryFn: () => getExamDetailsInstructor(id),
    enabled: !!id,
  });

  // جلب قائمة الكورسات الخاصة بالمدرس لتعبئة حقل الاختيار
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["instructorCoursesForExams"],
    queryFn: getInstructorCoursesForExams,
  });

  // تابع مساعد لصياغة البيانات القادمة من الـ API بشكل متوافق مع المدخلات والـ Types
  const getFormattedExamData = (details) => {
    if (!details) return {};
    return {
      exam_title_ar: details.title?.ar || "",
      exam_title_en: details.title?.en || "",
      min_degree: details.pass_mark || "",
      max_degree: details.full_mark || "",
      displayed_questions_count: details.displayed_questions_count || "",
      questions: (details.questions || []).map((q) => ({
        question_title_ar: q.title?.ar || "",
        question_title_en: q.title?.en || "",
        // تحويل القيمة القادمة من السيرفر (سواء 1/0 أو Boolean) إلى Boolean صريح متوافق مع الـ Checkbox
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

  // عمل تعبئة (Reset) للـ Form فور وصول البيانات من الـ API
  useEffect(() => {
    if (examDetails) {
      reset(getFormattedExamData(examDetails));
    }
  }, [examDetails, reset]);

  // 4. التحكم بمصفوفة الأسئلة الأساسية
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  // 5. إدارة الـ Mutation للتحديث وإرسال البيانات كـ FormData
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

  // 6. تحويل كائن البيانات (Object) إلى FormData بالصيغة المدعومة في السيرفر
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title[en]", data.exam_title_en);
    formData.append("title[ar]", data.exam_title_ar);
    formData.append("pass_mark", String(data.min_degree));
    formData.append("full_mark", String(data.max_degree));
    formData.append(
      "displayed_questions_count",
      String(data.displayed_questions_count),
    );

    data.questions.forEach((q, qIndex) => {
      formData.append(`questions[${qIndex}][title][en]`, q.question_title_en);
      formData.append(`questions[${qIndex}][title][ar]`, q.question_title_ar);

      // تحويل قيمة الـ Boolean إلى 0 أو 1 ليتم إرسالها بالمفتاح المطلوب
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

    // إرسال الـ FormData المجهزة مع الـ Mutation
    updateExamMutate(formData);
  };

  if (isExamLoading) return <InputsSkeleton />;

  return (
    <div className="space-y-6">
      {/* الهيدر العلوي */}
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
        {/* اسم الاختبار (عربي وإنجليزي) */}
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

        {/* الحد الأدنى للنجاح، الدرجة النهائية، وعدد الأسئلة المعروضة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* قسم بنك الأسئلة بالامتحانات */}
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

          {/* زر إضافة سؤال جديد يظهر فقط في وضع التعديل */}
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

        {/* أزرار الحفظ والإلغاء تظهر فقط في وضع التعديل */}
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
                // إعادة تعيين الحقول إلى تفاصيل الامتحان الأصلية المجلوبة من الـ API
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

// المكون الفرعي المتنقل لإدارة خيارات كل سؤال بشكل ديناميكي
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

        {/* حقل الـ Checkbox لتثبيت السؤال مدمج بشكل منظم ومتوافق مع الـ isEditing */}
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

      {/* عنوان السؤال (عربي وإنجليزي) */}
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

      {/* حقول الإجابات (الخيارات المضافة ديناميكياً) */}
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
              {/* إمكانية حذف الخيار فقط في وضع التعديل ولو زاد عن خيارين */}
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

        {/* زر إضافة خيار آخر للسؤال الحالي */}
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
