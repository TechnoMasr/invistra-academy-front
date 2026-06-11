import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";

const EditCourse = () => {
  // 1. حالة التحكم في وضع التعديل (عرض فقط أو تعديل)
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // بيانات الكورس الافتراضية (كمثال لما سيأتي من الـ API أو الـ Props)
  const courseData = {
    intro_video_url: "https://youtube.com/example",
    title_ar: "كورس رياكت مطور",
    title_en: "Advanced React Course",
    description_ar: "هذا الوصف مخصص لكورس الرياكت المتقدم باللغة العربية.",
    description_en: "This is the description for the advanced React course.",
    features: [
      {
        feature_title_ar: "ميزة أولى",
        feature_title_en: "First Feature",
        feature_desc_ar: "وصف الميزة الأولى بالعربي",
        feature_desc_en: "Description of first feature in English",
      },
    ],
    lectures_count: 24,
    course_duration: "12 ساعة",
    price_egp: 1500,
    price_usd: 50,
    course_image: "https://via.placeholder.com/150", // رابط الصورة المخزنة مسبقاً
  };

  // بناء الـ Schema
  const courseSchema = z.object({
    intro_video_url: z
      .string()
      .url("رابط الفيديو غير صالح")
      .or(z.string().optional()),
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
    features: z.array(
      z.object({
        feature_title_ar: z.string().min(3, "عنوان الميزة بالعربي مطلوب"),
        feature_title_en: z.string().min(3, "عنوان الميزة بالإنجليزي مطلوب"),
        feature_desc_ar: z.string().min(5, "وصف الميزة بالعربي مطلوب"),
        feature_desc_en: z.string().min(5, "وصف الميزة بالإنجليزي مطلوب"),
      }),
    ),
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
    reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: courseData, // تعبئة البيانات تلقائيًا هنا
  });

  // تحديث الصورة الافتراضية عند تحميل البيانات
  useEffect(() => {
    if (courseData?.course_image) {
      setImagePreview(courseData.course_image);
    }
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // إدارة الـ Mutation للتعديل
  const {
    mutate: updateCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      console.log("Updating Course with Data: ", formData);
      // هنا يتم استدعاء دالة الـ API الخاصة بالتحديث مثل axios.put
    },
    onSuccess: () => {
      setIsEditing(false); // العودة لوضع القراءة بعد النجاح
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "features") {
        formData.append(key, data[key]);
      }
    });
    formData.append("features", JSON.stringify(data.features));
    if (imageFile) {
      formData.append("course_image", imageFile);
    }

    updateCourseMutate(formData);
  };

  return (
    <div>
      {/* الهيدر العلوي المحتوي على عنوان الصفحة وزر التعديل */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title="تعديل الكورس" />

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
        {/* قسم رفع صورة الكورس */}
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            disabled={!isEditing} // تعطيل الرفع إذا لم نكن في وضع التعديل
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
            onClick={() => isEditing && fileInputRef.current.click()} // الضغط يعمل فقط في وضع التعديل
            className={`w-40 aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center overflow-hidden transition-all ${
              isEditing
                ? "cursor-pointer hover:bg-gray-100"
                : "cursor-not-allowed opacity-90"
            }`}
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
              disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
          <h3 className="text-lg font-semibold mb-4">ميزات تعلم الكورس</h3>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg mb-4 flex flex-col gap-4 relative"
            >
              {fields.length > 1 && isEditing && (
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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

          {/* زر إضافة ميزة جديدة يظهر فقط في وضع التعديل */}
          {isEditing && (
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
          )}
        </div>

        {/* عدد المحاضرات و مدة الكورس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <Controller
            name="lectures_count"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
                type="number"
                label="سعر الكورس بالدولار الأمريكي"
                placeholder="ادخل سعر الكورس بالدولار الأمريكي..."
                error={errors.price_usd?.message}
              />
            )}
          />
        </div>

        {/* أزرار الحفظ والإلغاء وتظهر فقط في وضع التعديل */}
        {isEditing && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center border-t pt-4">
            <Button
              type="submit"
              className="w-full md:w-60"
              disabled={isPending}
            >
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40"
              onClick={() => {
                reset(courseData); // استعادة البيانات الأصلية عند الإلغاء
                setImagePreview(courseData.course_image);
                setIsEditing(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
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

export default EditCourse;
