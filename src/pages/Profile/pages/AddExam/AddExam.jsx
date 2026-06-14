import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";

const AddExam = () => {
  // 1. بناء الـ Schema الخاص بالامتحان والأسئلة باللغة العربية
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

    // بنك الأسئلة بالامتحانات (مصفوفة ديناميكية)
    questions: z
      .array(
        z.object({
          question_title_ar: z.string().min(5, "عنوان السؤال بالعربي مطلوب"),
          question_title_en: z.string().min(5, "عنوان السؤال بالإنجليزي مطلوب"),

          // الإجابات الأربعة بالعربي والإنجليزي
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

  // 2. إعداد الـ Form مع القيم الافتراضية
  const {
    handleSubmit,
    control,
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
          ans_1_ar: "",
          ans_1_en: "",
          ans_2_ar: "",
          ans_2_en: "",
          ans_3_ar: "",
          ans_3_en: "",
          ans_4_ar: "",
          ans_4_en: "",
        },
      ],
    },
  });

  // 3. التحكم بإضافة وحذف الأسئلة ديناميكيًا
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // 4. إدارة الـ Mutation لإرسال البيانات للـ API
  const {
    mutate: createExamMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (examData) => {
      console.log("Exam Data to send: ", examData);
      // هنا يتم استدعاء الـ API الخاص بك
    },
    onSuccess: () => {
      // التعامل مع حالة النجاح (توجيه أو مسح البيانات)
    },
  });

  const onSubmit = (data) => {
    createExamMutate(data);
  };

  // مصفوفة تجريبية للكورسات لتمريرها لـ MainInput من نوع select
  const courseOptions = [
    { label: "كورس البرمجة الـ Web", value: "1" },
    { label: "كورس التصميم UI/UX", value: "2" },
  ];

  return (
    <div className="space-y-6">
      <ProfileTitle title="إضافة كورس" />

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
                label="اسم الاختبار باللغة الانجليزية"
                placeholder="ادخل اسم الاختبار.."
                error={errors.exam_title_en?.message}
                dir="ltr"
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
              {fields.length > 1 && (
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
                      label="عنوان السؤال باللغة الانجليزية"
                      placeholder="أضف عنوان السؤال.."
                      error={
                        errors.questions?.[index]?.question_title_en?.message
                      }
                      dir="ltr"
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
                      label="الاجابة الاولى (الصحيحة) باللغة الانجليزية"
                      placeholder="ادخل الاجابة الاولى (الصحيحة).."
                      error={errors.questions?.[index]?.ans_1_en?.message}
                      dir="ltr"
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
                      label="الاجابة الثانية باللغة الانجليزية"
                      placeholder="ادخل الاجابة الثانية.."
                      error={errors.questions?.[index]?.ans_2_en?.message}
                      dir="ltr"
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
                      label="الاجابة الثالثة باللغة الانجليزية"
                      placeholder="ادخل الاجابة الثالثة.."
                      error={errors.questions?.[index]?.ans_3_en?.message}
                      dir="ltr"
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
                      label="الاجابة الرابعة باللغة الانجليزية"
                      placeholder="ادخل الاجابة الرابعة.."
                      error={errors.questions?.[index]?.ans_4_en?.message}
                      dir="ltr"
                    />
                  )}
                />
              </div>
            </div>
          ))}

          {/* زر إضافة سؤال جديد */}
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
        </div>

        {/* زر الحفظ وأخطاء السيرفر */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <Button
            type="submit"
            className="w-full md:w-60 rounded-full"
            disabled={isPending}
          >
            {isPending ? "جاري الحفظ..." : "حفظ"}
          </Button>

          {error && (
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                "حدث خطأ ما، يرجى المحاولة مرة أخرى"
              }
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddExam;
