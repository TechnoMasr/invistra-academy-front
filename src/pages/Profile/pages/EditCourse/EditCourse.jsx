import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import {
  getMyCourseDetailsInstructor,
  updateCourse,
} from "@/api/myCoursesServices";
import InputsSkeleton from "@/components/Loading/SkeletonLoading/InputsSkeleton";

const EditCourse = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // جلب بيانات الكورس من الـ API
  const { data: course, isLoading } = useQuery({
    queryKey: ["myCourseDetails", id],
    queryFn: () => getMyCourseDetailsInstructor(id),
  });

  // بناء الـ Schema باللغة العربية مباشرة (مطابق تماماً لصفحة الإضافة)
  const courseSchema = z.object({
    link: z.string().url("رابط الفيديو غير صالح").or(z.string().optional()),

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

    learnings: z.array(
      z.object({
        title_ar: z.string().min(3, "عنوان الميزة بالعربي مطلوب"),
        title_en: z.string().min(3, "عنوان الميزة بالإنجليزي مطلوب"),
        description_ar: z.string().min(5, "وصف الميزة بالعربي مطلوب"),
        description_en: z.string().min(5, "وصف الميزة بالإنجليزي مطلوب"),
      }),
    ),

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
      (val) =>
        val === "" || val === undefined || val === null
          ? undefined
          : Number(val),
      z.number().min(0, "السعر قبل الخصم غير صالح").optional(),
    ),
    dollar_price_before_discount: z.preprocess(
      (val) =>
        val === "" || val === undefined || val === null
          ? undefined
          : Number(val),
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

  // التحكم بميزات الكورس ديناميكيًا
  const { fields, append, remove } = useFieldArray({
    control,
    name: "learnings",
  });

  // دالة مساعدة لتشكيل وتجهيز البيانات القادمة من الـ API لتتوافق مع الـ Form
  const formatCourseData = (data) => {
    if (!data) return {};
    return {
      link: data.link || "",
      name_ar: data.name?.ar || "",
      name_en: data.name?.en || "",
      description_ar: data.description?.ar || "",
      description_en: data.description?.en || "",
      // عمل تحويل (Mapping) من what_will_learn إلى learnings الحقل المطلوب بالـ Form
      learnings: data.what_will_learn?.map((item) => ({
        title_ar: item.title_ar || "",
        title_en: item.title_en || "",
        description_ar: item.description_ar || "",
        description_en: item.description_en || "",
      })) || [
        {
          title_ar: "",
          title_en: "",
          description_ar: "",
          description_en: "",
        },
      ],
      duration: data.duration || "",
      price: data.price || "",
      dollar_price: data.dollar_price || "",
      price_before_discount: data.price_before_discount || "",
      dollar_price_before_discount: data.dollar_price_before_discount || "",
    };
  };

  // عمل تحديث و Reset للـ Form بمجرد جلب البيانات بنجاح من الـ API
  useEffect(() => {
    if (course) {
      reset(formatCourseData(course));
      if (course.image) {
        setImagePreview(course.image);
      }
    }
  }, [course, reset]);

  // إدارة الـ Mutation لتحديث البيانات عبر الـ API
  const {
    mutate: updateCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (formData) => updateCourse(formData, id),
    onSuccess: () => {
      toast.success("تم تحديث الكورس بنجاح");
      setIsEditing(false);
      queryClient.invalidateQueries(["myCourseDetails", id]);
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

    if (
      data.price_before_discount !== undefined &&
      data.price_before_discount !== ""
    ) {
      formData.append("price_before_discount", data.price_before_discount);
    }
    if (
      data.dollar_price_before_discount !== undefined &&
      data.dollar_price_before_discount !== ""
    ) {
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

    // إرسال الصورة فقط في حال تم تغييرها واختيار ملف جديد
    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateCourseMutate(formData);
  };

  if (isLoading) return <InputsSkeleton />;

  return (
    <div className="space-y-6">
      {/* الهيدر العلوي المحتوي على عنوان الصفحة وزر التعديل */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title="تفاصيل الكورس" />

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
            disabled={!isEditing}
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
            onClick={() => isEditing && fileInputRef.current.click()}
            className={`w-full max-w-60 aspect-5/3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center overflow-hidden transition-all ${
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
              disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                  className="absolute top-2 inset-e-2 text-xs text-red-500 hover:underline"
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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

          {/* زر إضافة ميزة جديدة يظهر فقط في وضع التعديل */}
          {isEditing && (
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
          )}
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
              disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
                type="number"
                label="السعر قبل الخصم بالدولار الأمريكي"
                placeholder="ادخل السعر قبل الخصم..."
                error={errors.dollar_price_before_discount?.message}
              />
            )}
          />
        </div>

        {/* أزرار التحكم - تظهر فقط في وضع التعديل */}
        {isEditing && (
          <div className="mt-4 flex flex-col md:flex-row gap-3 items-center justify-center border-t pt-4">
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
                reset(formatCourseData(course));
                setImagePreview(course?.image || null);
                setImageFile(null);
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
