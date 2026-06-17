import React, { useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import { createCourse } from "@/api/myCoursesServices";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AddCourse = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // بناء الـ Schema باللغة العربية مباشرة
  const courseSchema = z.object({
    link: z.string().url("رابط الفيديو غير صالح").or(z.string().optional()),

    // بيانات الكورس الأساسية باللغتين
    name_ar: z.string().min(3, "اسم الكورس بالعربي مطلوب (3 أحرف على الأقل)"),
    name_en: z
      .string()
      .min(3, "اسم الكورس بالإنجليزي مطلوب (3 أحرف على الأقل)"),
    description_ar: z
      .string()
      .min(10, "وصف الكورس بالعربي مطلوب (10 أحرف على الأقل)"),
    description_en: z
      .string()
      .min(10, "وصف الكورس بالإنجليزي مطلوب (10 أحرف على الأقل)"),

    // ميزات تعلم الكورس (مصفوفة ديناميكية)
    learnings: z.array(
      z.object({
        title_ar: z.string().min(3, "عنوان الميزة بالعربي مطلوب"),
        title_en: z.string().min(3, "عنوان الميزة بالإنجليزي مطلوب"),
        description_ar: z.string().min(5, "وصف الميزة بالعربي مطلوب"),
        description_en: z.string().min(5, "وصف الميزة بالإنجليزي مطلوب"),
      }),
    ),

    // الحقول السفلية للكورس
    duration: z
      .string()
      .min(1, "مدة الكورس مطلوبة")
      .regex(/^\d{2}:\d{2}$/, "صيغة المدة يجب أن تكون HH:MM مثل 05:30"),
    price: z.preprocess((val) => Number(val), z.number().min(0, "السعر مطلوب")),
    dollar_price: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "السعر مطلوب"),
    ),
    price_before_discount: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0, "السعر قبل الخصم غير صالح").optional(),
    ),
    dollar_price_before_discount: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0, "السعر قبل الخصم غير صالح").optional(),
    ),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      link: "",
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      learnings: [
        {
          title_ar: "",
          title_en: "",
          description_ar: "",
          description_en: "",
        },
      ],
      duration: "",
      price: "",
      dollar_price: "",
      price_before_discount: "",
      dollar_price_before_discount: "",
    },
  });

  // التحكم بإضافة وحذف ميزات الكورس ديناميكيًا
  const { fields, append, remove } = useFieldArray({
    control,
    name: "learnings",
  });

  // إدارة الـ Mutation لإرسال البيانات للـ Back-end عبر createCourse
  const {
    mutate: createCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      reset();
      toast.success("تم انشاء الكورس بنجاح");
      navigate("/profile/my-courses");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // الحقول النصية البسيطة بأسماء الـ backend المطلوبة
    formData.append("name[en]", data.name_en);
    formData.append("name[ar]", data.name_ar);
    formData.append("description[en]", data.description_en);
    formData.append("description[ar]", data.description_ar);
    formData.append("price", data.price);
    formData.append("dollar_price", data.dollar_price);
    if (data.price_before_discount !== undefined) {
      formData.append("price_before_discount", data.price_before_discount);
    }
    if (data.dollar_price_before_discount !== undefined) {
      formData.append(
        "dollar_price_before_discount",
        data.dollar_price_before_discount,
      );
    }
    formData.append("duration", data.duration);
    formData.append("link", data.link);

    // مصفوفة الـ learnings بصيغة learnings[index][field][lang]
    data.learnings.forEach((item, index) => {
      formData.append(`learnings[${index}][title][en]`, item.title_en);
      formData.append(`learnings[${index}][title][ar]`, item.title_ar);
      formData.append(
        `learnings[${index}][description][en]`,
        item.description_en,
      );
      formData.append(
        `learnings[${index}][description][ar]`,
        item.description_ar,
      );
    });

    // الصورة الرئيسية فقط (image) - تم إلغاء thumbnail بناءً على الطلب
    if (imageFile) {
      formData.append("image", imageFile);
    }

    createCourseMutate(formData);
  };

  return (
    <div className="space-y-6">
      <ProfileTitle title="إضافة كورس" />

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
            className="w-full max-w-60 aspect-5/3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-all"
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
                <IoImageOutline className="text-7xl" />
                <span className="">صورة الكورس</span>
              </div>
            )}
          </div>
        </div>

        {/* حقل الفيديو التعريفي (link) */}
        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <MainInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              label="رابط الفيديو التعريفي"
              placeholder="https://example.com"
              error={errors.link?.message}
            />
          )}
        />

        {/* اسم الكورس (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                label="اسم الكورس باللغة العربية"
                placeholder="ادخل اسم الكورس..."
                error={errors.name_ar?.message}
              />
            )}
          />
          <Controller
            name="name_en"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                label="اسم الكورس باللغة الانجليزية"
                placeholder="ادخل اسم الكورس..."
                error={errors.name_en?.message}
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
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                label="وصف الكورس باللغة العربية"
                placeholder="أضف وصف للكورس..."
                error={errors.description_ar?.message}
                type="textarea"
              />
            )}
          />
          <Controller
            name="description_en"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                label="وصف الكورس باللغة الانجليزية"
                placeholder="أضف وصف للكورس..."
                error={errors.description_en?.message}
                type="textarea"
              />
            )}
          />
        </div>

        {/* قسم إضافة ميزات تعلم الكورس الديناميكي (learnings) */}
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
                  name={`learnings.${index}.title_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="عنوان الميزة باللغة العربية"
                      placeholder="ادخل عنوان الميزة..."
                      error={errors.learnings?.[index]?.title_ar?.message}
                    />
                  )}
                />
                <Controller
                  name={`learnings.${index}.title_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="عنوان الميزة باللغة الانجليزية"
                      placeholder="ادخل عنوان الميزة..."
                      error={errors.learnings?.[index]?.title_en?.message}
                    />
                  )}
                />
              </div>

              {/* وصف الميزة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`learnings.${index}.description_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="وصف الميزة باللغة العربية"
                      placeholder="أضف وصف للميزة..."
                      error={errors.learnings?.[index]?.description_ar?.message}
                      type="textarea"
                    />
                  )}
                />
                <Controller
                  name={`learnings.${index}.description_en`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="وصف الميزة باللغة الانجليزية"
                      placeholder="أضف وصف للميزة..."
                      error={errors.learnings?.[index]?.description_en?.message}
                      type="textarea"
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
                title_ar: "",
                title_en: "",
                description_ar: "",
                description_en: "",
              })
            }
            className="flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full hover:bg-gray-50 transition-all mt-2"
          >
            <span>+</span> إضافة ميزة جديدة
          </button>
        </div>

        {/* مدة الكورس */}
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                type="text"
                label="مدة الكورس"
                placeholder="مثال: 05:30"
                error={errors.duration?.message}
              />
            )}
          />

        {/* سعر الكورس (جنيه مصري ودولار أمريكي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                type="number"
                label="سعر الكورس بالجنيه المصري"
                placeholder="ادخل سعر الكورس بالجنيه المصري..."
                error={errors.price?.message}
              />
            )}
          />
          <Controller
            name="dollar_price"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                type="number"
                label="سعر الكورس بالدولار الأمريكي"
                placeholder="ادخل سعر الكورس بالدولار الأمريكي..."
                error={errors.dollar_price?.message}
              />
            )}
          />
        </div>

        {/* السعر قبل الخصم (جنيه مصري ودولار أمريكي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="price_before_discount"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                type="number"
                label="السعر قبل الخصم بالجنيه المصري"
                placeholder="ادخل السعر قبل الخصم..."
                error={errors.price_before_discount?.message}
              />
            )}
          />
          <Controller
            name="dollar_price_before_discount"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                type="number"
                label="السعر قبل الخصم بالدولار الأمريكي"
                placeholder="ادخل السعر قبل الخصم..."
                error={errors.dollar_price_before_discount?.message}
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
