import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
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
  const { id } = useParams(); // جلب معرف الامتحان من الـ URL
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 1. بناء الـ Schema الديناميكي المتوافق مع هيكل الـ options الجديد
  const examSchema = z.object({
    exam_title_ar: z.string().min(3, "اسم الاختبار بالعربي مطلوب"),
    exam_title_en: z.string().min(3, "اسم الاختبار بالإنجليزي مطلوب"),
    min_degree: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "الحد الأدنى للنجاح مطلوب ويجب أن يكون أكبر من 0"),
    ),
    max_degree: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "الدرجة النهائية للاختبار مطلوبة"),
    ),
    questions: z
      .array(
        z.object({
          question_title_ar: z.string().min(5, "عنوان السؤال بالعربي مطلوب"),
          question_title_en: z.string().min(5, "عنوان السؤال بالإنجليزي مطلوب"),
          options: z
            .array(
              z.object({
                option_ar: z.string().min(1, "الخيار بالعربي مطلوب"),
                option_en: z.string().min(1, "الخيار بالإنجليزي مطلوب"),
              }),
            )
            .min(2, "يجب إضافة خيارين على الأقل للسؤال")
            .max(4, "الحد الأقصى هو 4 خيارات فقط"),
        }),
      )
      .min(1, "يجب إضافة سؤال واحد على الأقل"),
  });

  // 2. إعداد الـ Form
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

  // عمل تعبئة (Reset) للـ Form فور وصول البيانات من الـ API
  useEffect(() => {
    if (examDetails) {
      const formattedData = {
        exam_title_ar: examDetails.title?.ar || "",
        exam_title_en: examDetails.title?.en || "",
        min_degree: examDetails.pass_mark || "",
        max_degree: examDetails.full_mark || "",
        // تحويل الأسئلة والخيارات من الشكل القادم من السيرفر إلى شكل المصفوفات المتداخلة
        questions: (examDetails.questions || []).map((q) => ({
          question_title_ar: q.title?.ar || "",
          question_title_en: q.title?.en || "",
          options: (q.options || []).map((opt) => ({
            option_ar: opt.option?.ar || "",
            option_en: opt.option?.en || "",
          })),
        })),
      };
      reset(formattedData);
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
      toast.success("تم تحديث الامتحان بنجاح");
      setIsEditing(false);
      // navigate(`/profile/exams`);
    },
  });

  // 6. تحويل كائن البيانات (Object) إلى FormData بالصيغة المدعومة في السيرفر
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title[en]", data.exam_title_en);
    formData.append("title[ar]", data.exam_title_ar);
    formData.append("pass_mark", String(data.min_degree));
    formData.append("full_mark", String(data.max_degree));

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

    // إرسال الـ FormData المجهزة مع الـ Mutation
    updateExamMutate(formData);
  };

  if (isExamLoading) return <InputsSkeleton />;

  return (
    <div className="space-y-6">
      {/* الهيدر العلوي */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title="تفاصيل الاختبار" />

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-medium py-1.5 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm hover:bg-primary/5 transition-all"
          >
            <FaRegEdit className="w-4 h-4" />
            <span>تعديل البيانات</span>
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
                label="اسم الاختبار باللغة العربية"
                placeholder="ادخل اسم الاختبار.."
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
                label="اسم الاختبار باللغة الانجليزية"
                placeholder="ادخل اسم الاختبار.."
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
                disabled={!isEditing}
                label="الحد الأدنى للنجاح"
                placeholder="ادخل الحد الأدنى للنجاح.."
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
                label="الدرجة النهائية للاختبار"
                placeholder="ادخل الدرجة النهائية للاختبار.."
                error={errors.max_degree?.message}
              />
            )}
          />
        </div>

        {/* قسم بنك الأسئلة بالامتحانات */}
        <div className="border-t pt-6 mt-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              بنك الأسئلة الخاصة بالاختبارات
            </h3>
            <span className="text-xs text-orange-500 font-medium">
              * يتم الاختيار منها عشوائياً في الاختبار
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
                  options: [
                    { option_ar: "", option_en: "" },
                    { option_ar: "", option_en: "" },
                  ],
                })
              }
              className="flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full hover:bg-gray-50 transition-all mt-2"
            >
              <span className="text-lg">+</span> إضافة سؤال جديد
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
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40 rounded-full"
              onClick={() => {
                // إعادة تعيين الحقول إلى تفاصيل الامتحان الأصلية المجلوبة من الـ API
                if (examDetails) {
                  reset({
                    exam_title_ar: examDetails.title?.ar || "",
                    exam_title_en: examDetails.title?.en || "",
                    min_degree: examDetails.pass_mark || "",
                    max_degree: examDetails.full_mark || "",
                    questions: (examDetails.questions || []).map((q) => ({
                      question_title_ar: q.title?.ar || "",
                      question_title_en: q.title?.en || "",
                      options: (q.options || []).map((opt) => ({
                        option_ar: opt.option?.ar || "",
                        option_en: opt.option?.en || "",
                      })),
                    })),
                  });
                }
                setIsEditing(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        )}

        {error && (
          <div className="flex justify-center mt-4">
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                "حدث خطأ ما، يرجى المحاولة مرة أخرى"
              }
            />
          </div>
        )}
      </form>
    </div>
  );
};

// المكون الفرعي المتنقل لإدارة خيارات كل سؤال بشكل ديناميكي مع ميزة تعطيل وتفعيل المدخلات بناءً على وضع التعديل
const QuestionFieldsGroup = ({
  questionIndex,
  control,
  errors,
  removeQuestion,
  totalQuestions,
  isEditing,
}) => {
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
          حذف السؤال
        </button>
      )}

      <h4 className="text-sm font-bold text-primary">
        السؤال رقم ({questionIndex + 1})
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
              disabled={!isEditing}
              label="عنوان السؤال باللغة العربية"
              placeholder="أضف عنوان السؤال.."
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
              label="عنوان السؤال باللغة الانجليزية"
              placeholder="أضف عنوان السؤال.."
              error={
                errors.questions?.[questionIndex]?.question_title_en?.message
              }
            />
          )}
        />
      </div>

      {/* حقول الإجابات (الخيارات المضافة ديناميكياً) */}
      <div className="space-y-4 border-t pt-4 mt-2">
        <h5 className="text-xs font-bold text-gray-700">خيارات الإجابة:</h5>

        {optionFields.map((optItem, optIndex) => (
          <div
            key={optItem.id}
            className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-gray-100 relative"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-semibold">
                الخيار رقم ({optIndex + 1}){" "}
                {optIndex === 0 && (
                  <span className="text-green-600">(الإجابة الصحيحة)</span>
                )}
              </span>
              {/* إمكانية حذف الخيار فقط في وضع التعديل ولو زاد عن خيارين */}
              {optionFields.length > 2 && isEditing && (
                <button
                  type="button"
                  onClick={() => removeOption(optIndex)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  حذف الخيار
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
                    label="الخيار باللغة العربية"
                    placeholder="ادخل الخيار بالعربي.."
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
                    label="الخيار باللغة الانجليزية"
                    placeholder="ادخل الخيار بالإنجليزي.."
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
            + إضافة خيار آخر لهذا السؤال
          </button>
        )}
      </div>
    </div>
  );
};

export default EditExam;
