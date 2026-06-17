import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";

const EditExam = () => {
  // 1. حالة التحكم في وضع التعديل (عرض فقط أو تعديل)
  const [isEditing, setIsEditing] = useState(false);

  // بيانات الاختبار الافتراضية (كمثال لما سيأتي من الـ API أو الـ Props)
  const examData = {
    course_id: "1",
    exam_title_ar: "اختبار أساسيات الجافا سكريبت",
    exam_title_en: "JavaScript Basics Exam",
    min_degree: 50,
    max_degree: 100,
    questions: [
      {
        question_title_ar: "ما هي طريقة تعريف متغير ثابت في الجافا سكريبت؟",
        question_title_en:
          "How do you declare a constant variable in JavaScript?",
        ans_1_ar: "const",
        ans_1_en: "const",
        ans_2_ar: "let",
        ans_2_en: "let",
        ans_3_ar: "var",
        ans_3_en: "var",
        ans_4_ar: "constant",
        ans_4_en: "constant",
      },
    ],
  };

  // 2. بناء الـ Schema للتحقق من المدخلات
  const examSchema = z.object({
    course_id: z.string().min(1, "الرجاء اختيار الكورس"),
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
          ans_1_ar: z
            .string()
            .min(1, "الإجابة الأولى (الصحيحة) بالعربي مطلوبة"),
          ans_1_en: z
            .string()
            .min(1, "الإجابة الأولى (الصحيحة) بالإنجليزي مطلوبة"),
          ans_2_ar: z.string().min(1, "الإجابة الثانية بالعربي مطلوبة"),
          ans_2_en: z.string().min(1, "الإجابة الثانية بالإنجليزي مطلوبة"),
          ans_3_ar: z.string().min(1, "الإجابة الثالثة بالعربي مطلوبة"),
          ans_3_en: z.string().min(1, "الإجابة الثالثة بالإنجليزي مطلوبة"),
          ans_4_ar: z.string().min(1, "الإجابة الرابعة بالعربي مطلوبة"),
          ans_4_en: z.string().min(1, "الإجابة الرابعة بالإنجليزي مطلوبة"),
        }),
      )
      .min(1, "يجب إضافة سؤال واحد على الأقل"),
  });

  // 3. إعداد الـ Form مع تعبئة البيانات الافتراضية تلقائياً
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: examData,
  });

  // التحكم بمصفوفة الأسئلة
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // 4. إدارة الـ Mutation للتعديل وإرسال البيانات الجديدة للـ Back-end
  const {
    mutate: updateExamMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (updatedData) => {
      console.log("Updating Exam with Data: ", updatedData);
      // هنا يتم استدعاء الـ API الخاص بالتحديث مثل axios.put
    },
    onSuccess: () => {
      setIsEditing(false); // العودة لوضع العرض فقط بعد النجاح
    },
  });

  const onSubmit = (data) => {
    updateExamMutate(data);
  };

  // مصفوفة تجريبية للكورسات لتمريرها لـ MainInput من نوع select
  const courseOptions = [
    { label: "كورس البرمجة الـ Web", value: "1" },
    { label: "كورس التصميم UI/UX", value: "2" },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto" dir="rtl">
      {/* الهيدر العلوي المحتوي على عنوان الصفحة وزر التعديل */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title="تعديل الاختبار" />

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
        {/* حقل اختيار الكورس */}
        <div className="w-full">
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="select"
                disabled={!isEditing}
                label="الكورس"
                placeholder="اختر الكورس"
                options={courseOptions}
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

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-6 bg-gray-50/60 border border-gray-100 rounded-xl mb-6 flex flex-col gap-4 relative"
            >
              {/* يظهر زر حذف السؤال فقط لو كنا في وضع التعديل وهناك أكثر من سؤال */}
              {fields.length > 1 && isEditing && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 left-4 text-sm text-red-500 hover:text-red-700 font-medium hover:underline transition-all"
                >
                  حذف السؤال
                </button>
              )}

              <h4 className="text-sm font-bold text-primary">
                السؤال رقم ({index + 1})
              </h4>

              {/* عنوان السؤال (عربي وإنجليزي) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`questions.${index}.question_title_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="textarea"
                      disabled={!isEditing}
                      label="عنوان السؤال باللغة العربية"
                      placeholder="أضف عنوان السؤال.."
                      error={
                        errors.questions?.[index]?.question_title_ar?.message
                      }
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.question_title_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="textarea"
                      disabled={!isEditing}
                      label="عنوان السؤال باللغة الانجليزية"
                      placeholder="أضف عنوان السؤال.."
                      error={
                        errors.questions?.[index]?.question_title_en?.message
                      }
                    />
                  )}
                />
              </div>

              {/* الإجابة الأولى الصحيحة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`questions.${index}.ans_1_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الاولى (الصحيحة) باللغة العربية"
                      placeholder="ادخل الاجابة الاولى (الصحيحة).."
                      error={errors.questions?.[index]?.ans_1_ar?.message}
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.ans_1_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الاولى (الصحيحة) باللغة الانجليزية"
                      placeholder="ادخل الاجابة الاولى (الصحيحة).."
                      error={errors.questions?.[index]?.ans_1_en?.message}
                    />
                  )}
                />
              </div>

              {/* الإجابة الثانية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`questions.${index}.ans_2_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الثانية باللغة العربية"
                      placeholder="ادخل الاجابة الثانية.."
                      error={errors.questions?.[index]?.ans_2_ar?.message}
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.ans_2_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الثانية باللغة الانجليزية"
                      placeholder="ادخل الاجابة الثانية.."
                      error={errors.questions?.[index]?.ans_2_en?.message}
                    />
                  )}
                />
              </div>

              {/* الإجابة الثالثة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`questions.${index}.ans_3_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الثالثة باللغة العربية"
                      placeholder="ادخل الاجابة الثالثة.."
                      error={errors.questions?.[index]?.ans_3_ar?.message}
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.ans_3_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الثالثة باللغة الانجليزية"
                      placeholder="ادخل الاجابة الثالثة.."
                      error={errors.questions?.[index]?.ans_3_en?.message}
                    />
                  )}
                />
              </div>

              {/* الإجابة الرابعة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`questions.${index}.ans_4_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الرابعة باللغة العربية"
                      placeholder="ادخل الاجابة الرابعة.."
                      error={errors.questions?.[index]?.ans_4_ar?.message}
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.ans_4_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      disabled={!isEditing}
                      label="الاجابة الرابعة باللغة الانجليزية"
                      placeholder="ادخل الاجابة الرابعة.."
                      error={errors.questions?.[index]?.ans_4_en?.message}
                    />
                  )}
                />
              </div>
            </div>
          ))}

          {/* زر إضافة سؤال جديد يظهر فقط في وضع التعديل */}
          {isEditing && (
            <button
              type="button"
              onClick={() =>
                append({
                  question_title_ar: "",
                  question_title_en: "",
                  ans_1_ar: "",
                  ans_1_en: "",
                  ans_2_ar: "",
                  ans_2_en: "",
                  ans_3_ar: "",
                  ans_3_en: "",
                  ans_4_ar: "",
                  ans_4_en: "",
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
                reset(examData); // استعادة البيانات الأصلية عند إلغاء التعديل
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

export default EditExam;
