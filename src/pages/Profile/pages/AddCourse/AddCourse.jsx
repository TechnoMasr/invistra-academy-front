import React, { useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";

// افتراضًا أن هناك خدمة لتخزين الكورس، يمكنك تعديلها بمسار الـ API الخاص بك
// import { createCourse } from "@/api/courseServices";

const AddCourse = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // بناء الـ Schema باللغة العربية مباشرة
  const courseSchema = z.object({
    intro_video_url: z
      .string()
      .url("رابط الفيديو غير صالح")
      .or(z.string().optional()),

    // بيانات الكورس الأساسية باللغتين
    title_ar: z.string().min(3, "اسم الكورس بالعربي مطلوب (3 أحرف على الأقل)"),
    title_en: z
      .string()
      .min(3, "اسم الكورس بالإنجليزي مطلوب (3 أحرف على الأقل)"),
    description_ar: z
      .string()
      .min(10, "وصف الكورس بالعربي مطلوب (10 أحرف على الأقل)"),
    description_en: z
      .string()
      .min(10, "وصف الكورس بالإنجليزي مطلوب (10 أحرف على الأقل)"),

    // ميزات تعلم الكورس (مصفوفة ديناميكية)
    features: z.array(
      z.object({
        feature_title_ar: z.string().min(3, "عنوان الميزة بالعربي مطلوب"),
        feature_title_en: z.string().min(3, "عنوان الميزة بالإنجليزي مطلوب"),
        feature_desc_ar: z.string().min(5, "وصف الميزة بالعربي مطلوب"),
        feature_desc_en: z.string().min(5, "وصف الميزة بالإنجليزي مطلوب"),
      }),
    ),

    // الحقول السفلية للكورس
    lectures_count: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "عدد المحاضرات يجب أن يكون 1 أو أكثر"),
    ),
    course_duration: z.string().min(1, "مدة الكورس مطلوبة"),
    price_egp: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "السعر مطلوب"),
    ),
    price_usd: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "السعر مطلوب"),
    ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      intro_video_url: "",
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      features: [
        {
          feature_title_ar: "",
          feature_title_en: "",
          feature_desc_ar: "",
          feature_desc_en: "",
        },
      ],
      lectures_count: "",
      course_duration: "",
      price_egp: "",
      price_usd: "",
    },
  });

  // التحكم بإضافة وحذف ميزات الكورس ديناميكيًا
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // إدارة الـ Mutation لإرسال البيانات للـ Back-end
  const {
    mutate: createCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      console.log("FormData to send: ", formData);
    },
    onSuccess: () => {
      // التوجيه أو إظهار رسالة نجاح هنا
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // إضافة الحقول النصية العادية للـ FormData
    Object.keys(data).forEach((key) => {
      if (key !== "features") {
        formData.append(key, data[key]);
      }
    });

    // تحويل مصفوفة الميزات إلى نص JSON
    formData.append("features", JSON.stringify(data.features));

    // إضافة ملف الصورة إذا تم اختياره
    if (imageFile) {
      formData.append("course_image", imageFile);
    }

    createCourseMutate(formData);
  };

  return (
    <div>
      <h2 className="text-2xl lg:text-4xl font-bold text-center mb-6">إضافة كورس</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* قسم رفع صورة الكورس */}
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current.click()}
            className="w-40 aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-all"
          >
            {imagePreview ? (
              <img
                loading="lazy"
                src={imagePreview}
                alt="Course preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <IoImageOutline className="text-4xl" />
                <span className="text-xs">صورة الكورس</span>
              </div>
            )}
          </div>
        </div>

        {/* حقل الفيديو التعريفي */}
        <Controller
          name="intro_video_url"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label="الفيديو التعريفي"
              placeholder="https://example.com"
              error={errors.intro_video_url?.message}
            />
          )}
        />

        {/* اسم الكورس (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="title_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="اسم الكورس باللغة العربية"
                placeholder="ادخل اسم الكورس..."
                error={errors.title_ar?.message}
              />
            )}
          />
          <Controller
            name="title_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="اسم الكورس باللغة الانجليزية"
                placeholder="ادخل اسم الكورس..."
                error={errors.title_en?.message}
                dir="ltr"
              />
            )}
          />
        </div>

        {/* وصف الكورس (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="description_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="وصف الكورس باللغة العربية"
                placeholder="أضف وصف للكورس..."
                error={errors.description_ar?.message}
                isTextArea
              />
            )}
          />
          <Controller
            name="description_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="وصف الكورس باللغة الانجليزية"
                placeholder="أضف وصف للكورس..."
                error={errors.description_en?.message}
                isTextArea
                dir="ltr"
              />
            )}
          />
        </div>

        {/* قسم إضافة ميزات تعلم الكورس الديناميكي */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">
            إضافة ميزات تعلم الكورس
          </h3>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg mb-4 flex flex-col gap-4 relative"
            >
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 left-2 text-xs text-red-500 hover:underline"
                >
                  حذف
                </button>
              )}

              {/* عنوان الميزة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`features.${index}.feature_title_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label="عنوان الميزة باللغة العربية"
                      placeholder="ادخل عنوان الميزة..."
                      error={
                        errors.features?.[index]?.feature_title_ar?.message
                      }
                    />
                  )}
                />
                <Controller
                  name={`features.${index}.feature_title_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label="عنوان الميزة باللغة الانجليزية"
                      placeholder="ادخل عنوان الميزة..."
                      error={
                        errors.features?.[index]?.feature_title_en?.message
                      }
                      dir="ltr"
                    />
                  )}
                />
              </div>

              {/* وصف الميزة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`features.${index}.feature_desc_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label="وصف الميزة باللغة العربية"
                      placeholder="أضف وصف للميزة..."
                      error={errors.features?.[index]?.feature_desc_ar?.message}
                      isTextArea
                    />
                  )}
                />
                <Controller
                  name={`features.${index}.feature_desc_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      label="وصف الميزة باللغة الانجليزية"
                      placeholder="أضف وصف للميزة..."
                      error={errors.features?.[index]?.feature_desc_en?.message}
                      isTextArea
                      dir="ltr"
                    />
                  )}
                />
              </div>
            </div>
          ))}

          {/* زر إضافة ميزة جديدة */}
          <button
            type="button"
            onClick={() =>
              append({
                feature_title_ar: "",
                feature_title_en: "",
                feature_desc_ar: "",
                feature_desc_en: "",
              })
            }
            className="flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full hover:bg-gray-50 transition-all mt-2"
          >
            <span>+</span> إضافة ميزة جديدة
          </button>
        </div>

        {/* عدد المحاضرات و مدة الكورس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <Controller
            name="lectures_count"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="number"
                label="عدد المحاضرات"
                placeholder="ادخل عدد محاضرات الكورس..."
                error={errors.lectures_count?.message}
              />
            )}
          />
          <Controller
            name="course_duration"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="مدة الكورس"
                placeholder="ادخل مدة الكورس..."
                error={errors.course_duration?.message}
              />
            )}
          />
        </div>

        {/* سعر الكورس (جنيه مصري ودولار أمريكي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="price_egp"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="number"
                label="سعر الكورس بالجنيه المصري"
                placeholder="ادخل سعر الكورس بالجنيه المصري..."
                error={errors.price_egp?.message}
              />
            )}
          />
          <Controller
            name="price_usd"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="number"
                label="سعر الكورس بالدولار الأمريكي"
                placeholder="ادخل سعر الكورس بالدولار الأمريكي..."
                error={errors.price_usd?.message}
              />
            )}
          />
        </div>

        {/* زر الحفظ وأخطاء الخادم */}
        <div className="mt-4 flex flex-col gap-3 items-center">
          <Button type="submit" className="w-full md:w-60" disabled={isPending}>
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

export default AddCourse;
