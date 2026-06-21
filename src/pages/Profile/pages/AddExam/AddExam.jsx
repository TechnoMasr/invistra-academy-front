import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";
import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import { addExam, getInstructorCoursesForExams } from "@/api/ExamServices";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const AddExam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const examSchema = z.object({
    course_id: z.string().min(1, t("addExam.validation.courseRequired")),
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

    questions: z
      .array(
        z.object({
          question_title_ar: z.string().min(5, t("addExam.validation.questionArRequired")),
          question_title_en: z.string().min(5, t("addExam.validation.questionEnRequired")),

          // مصفوفة الخيارات لكل سؤال (إجباري 2 على الأقل، والحد الأقصى 4)
          options: z
            .array(
              z.object({
                option_ar: z.string().min(1, t("addExam.validation.optionArRequired")),
                option_en: z.string().min(1, t("addExam.validation.optionEnRequired")),
              }),
            )
            .min(2, t("addExam.validation.minOptions"))
            .max(4, t("addExam.validation.maxOptions")),
        }),
      )
      .min(1, t("addExam.validation.minQuestions")),
  });

  // 2. إعداد الـ Form مع القيم الافتراضية (سؤال واحد يحتوي على خيارين إجباريين)
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      course_id: "",
      exam_title_ar: "",
      exam_title_en: "",
      min_degree: "",
      max_degree: "",
      questions: [
        {
          question_title_ar: "",
          question_title_en: "",
          options: [
            { option_ar: "", option_en: "" }, // الخيار الأول (الصحيح)
            { option_ar: "", option_en: "" }, // الخيار الثاني
          ],
        },
      ],
    },
  });

  // 3. التحكم بالأسئلة
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  // 4. إدارة الـ Mutation لربطها بالـ API المكتوب برقم الـ ID
  const {
    mutate: createExamMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ formData, courseId }) => {
      return await addExam(formData, courseId);
    },
    onSuccess: () => {
      toast.success(t("addExam.success"));
      reset();
      queryClient.invalidateQueries(["examsInstructor", 1]);
      navigate(`/profile/exams`);
    },
  });

  // 5. تحويل البيانات لشكل Form Data بالمفاتيح المطابقة للصورة تماماً
  const onSubmit = (data) => {
    const formData = new FormData();

    // البيانات الأساسية للامتحان
    formData.append("title[en]", data.exam_title_en);
    formData.append("title[ar]", data.exam_title_ar);
    formData.append("pass_mark", String(data.min_degree));
    formData.append("full_mark", String(data.max_degree));

    // تركيب أسئلة الامتحان وخياراتها بناءً على الشكل المطلوب بالصورة
    data.questions.forEach((q, qIndex) => {
      formData.append(`questions[${qIndex}][title][en]`, q.question_title_en);
      formData.append(`questions[${qIndex}][title][ar]`, q.question_title_ar);

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

    // إرسال البيانات الـ FormData مع الـ ID الخاص بالكورس المختار
    createExamMutate({ formData, courseId: data.course_id });
  };

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructorCoursesForExams"],
    queryFn: getInstructorCoursesForExams,
  });

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("addExam.title")} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* حقل اختيار الكورس */}
        <div className="w-full">
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="select"
                label={t("addExam.course")}
                placeholder={t("addExam.coursePlaceholder")}
                disabled={isLoading}
                options={
                  !isLoading
                    ? courses.map((course) => ({
                        label: course.name,
                        value: String(course.id),
                      }))
                    : []
                }
                error={errors.course_id?.message}
              />
            )}
          />
        </div>

        {/* اسم الاختبار (عربي وإنجليزي) */}
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

        {/* الحد الأدنى للنجاح والدرجة النهائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* قسم بنك الأسئلة */}
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
            />
          ))}

          {/* زر إضافة سؤال جديد */}
          <button
            type="button"
            onClick={() =>
              appendQuestion({
                question_title_ar: "",
                question_title_en: "",
                options: [
                  { option_ar: "", option_en: "" },
                  { option_ar: "", option_en: "" },
                ],
              })
            }
            className="flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full hover:bg-gray-50 transition-all mt-2"
          >
            {t("addExam.addQuestion")}
          </button>
        </div>

        {/* زر الحفظ وأخطاء السيرفر */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <Button
            type="submit"
            className="w-full md:w-60 rounded-full"
            disabled={isPending}
          >
            {isPending ? t("addExam.saving") : t("addExam.save")}
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

// مكون فرعي (Sub-component) لإدارة حقول كل سؤال والخيارات التابعة له بشكل منفصل وديناميكي
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
    <div className="p-6 bg-gray-50/60 border border-gray-100 rounded-xl mb-6 flex flex-col gap-4 relative">
      {totalQuestions > 1 && (
        <button
          type="button"
          onClick={() => removeQuestion(questionIndex)}
          className="absolute top-3 inset-e-4 text-sm text-red-500 hover:text-red-700 font-medium hover:underline transition-all"
        >
          {t("addExam.deleteQuestion")}
        </button>
      )}

      <h4 className="text-sm font-bold text-primary">
        {t("addExam.questionNumber", { number: questionIndex + 1 })}
      </h4>

      {/* عنوان السؤال (عربي وإنجليزي) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`questions.${questionIndex}.question_title_ar`}
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="textarea"
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
        <h5 className="text-xs font-bold text-gray-700">{t("addExam.answerOptions")}</h5>

        {optionFields.map((optItem, optIndex) => (
          <div
            key={optItem.id}
            className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-gray-100 relative"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-semibold">
                {t("addExam.optionNumber", { number: optIndex + 1 })}{" "}
                {optIndex === 0 && (
                  <span className="text-green-600">{t("addExam.correctAnswer")}</span>
                )}
              </span>
              {/* إمكانية حذف الخيار فقط لو زاد عن خيارين إجباريين */}
              {optionFields.length > 2 && (
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

        {/* زر إضافة خيار جديد للسؤال الحالي بشرط ألا يتعدى الـ 4 خيارات */}
        {optionFields.length < 4 && (
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

export default AddExam;
