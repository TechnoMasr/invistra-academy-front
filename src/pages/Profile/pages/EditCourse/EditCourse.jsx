import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import {
  getMyCourseDetailsInstructor,
  updateCourse,
} from "@/api/myCoursesServices";
import LoadingPage from "@/components/Loading/LoadingPage";

// استيراد مكونات الـ Select من shadcn/ui
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditCourse = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { id } = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // جلب الفئات الكلية المتاحة من Redux لتتبع المستويات الفرعية عند التعديل
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  // تتبع مسار الفئات المختارة في الـ State
  const [selectedCategories, setSelectedCategories] = useState([]);

  // جلب بيانات الكورس من الـ API
  const { data: course, isLoading } = useQuery({
    queryKey: ["myCourseDetails", id],
    queryFn: () => getMyCourseDetailsInstructor(id),
  });

  // تعبئة مسار شجرة الأقسام (selectedCategories) بناءً على الـ category_chain الراجع من الـ API فور تحميل البيانات
  useEffect(() => {
    if (course?.category_chain && course.category_chain.length > 0) {
      // استخراج الـ IDs من السلسلة وتحويلها لـ Strings لتتوافق مع الـ Select component
      const pathIds = course.category_chain.map((cat) => String(cat.id));
      setSelectedCategories(pathIds);
    }
  }, [course]);

  // بناء قائمة المستويات المتاحة للعرض ديناميكياً بناءً على المسار المختار والبيانات من Redux
  const renderLevels = [];
  let currentLevelOptions = categories || [];

  // بناء المستوى الأول (القسم الرئيسي) دائماً
  if (selectedCategories.length > 0) {
    const mainCategoryId = selectedCategories[0];
    const mainCategoryObj = currentLevelOptions.find(
      (cat) => String(cat.id) === String(mainCategoryId),
    );

    renderLevels.push({
      levelIndex: 0,
      options: currentLevelOptions,
      selectedValue: String(mainCategoryId),
      disabled: true, // القسم الرئيسي مغلق دائماً بناءً على فئة المدرس الثابتة
      parentName: "",
    });

    // بناء القوائم الفرعية المتتالية ديناميكياً
    if (mainCategoryObj && mainCategoryObj.sub_categories) {
      currentLevelOptions = mainCategoryObj.sub_categories;

      for (let i = 1; i < selectedCategories.length + 1; i++) {
        const parentId = selectedCategories[i - 1];
        const foundParent =
          i === 1
            ? mainCategoryObj
            : renderLevels[i - 1]?.options?.find(
                (cat) => String(cat.id) === parentId,
              );

        if (
          foundParent &&
          foundParent.sub_categories &&
          foundParent.sub_categories.length > 0
        ) {
          currentLevelOptions = foundParent.sub_categories;
          renderLevels.push({
            levelIndex: i,
            options: currentLevelOptions,
            selectedValue: selectedCategories[i] || "all",
            disabled: !isEditing, // تكون قابلة للتعديل فقط عند الضغط على زر التعديل
            parentName: foundParent.name,
          });
        } else {
          break;
        }
      }
    }
  }

  // التعامل مع تغيير قيم الفئات الفرعية أثناء وضع التعديل
  const handleCategoryChange = (levelIndex, value) => {
    if (value === "all") {
      // العودة إلى الأب مباشرة وتصفير الفروع التابعة له
      const newPath = selectedCategories.slice(0, levelIndex);
      setSelectedCategories(newPath);
      setValue("category_id", newPath[newPath.length - 1], {
        shouldValidate: true,
      });
    } else {
      // تحديث المسار بإضافة الـ ID الجديد وقص أي مستويات تالية
      const newPath = [...selectedCategories.slice(0, levelIndex)];
      newPath[levelIndex] = value;
      setSelectedCategories(newPath);
      setValue("category_id", value, { shouldValidate: true });
    }
  };

  // حقول التحقق للأسعار
  const requiredNumberSchema = z
    .string()
    .min(1, t("addCourse.validation.priceRequired"))
    .refine(
      (val) => !isNaN(Number(val)),
      t("addCourse.validation.priceRequired"),
    )
    .transform((val) => Number(val))
    .refine((val) => val >= 0, t("addCourse.validation.priceRequired"));

  // بناء الـ Schema
  const courseSchema = z.object({
    category_id: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, t("addCourse.validation.categoryRequired")),

    link: z
      .string()
      .url(t("addCourse.validation.invalidLink"))
      .optional()
      .or(z.literal("")),

    name_ar: z.string().min(3, t("addCourse.validation.nameArRequired")),
    name_en: z.string().min(3, t("addCourse.validation.nameEnRequired")),
    description_ar: z
      .string()
      .min(10, t("addCourse.validation.descArRequired")),
    description_en: z
      .string()
      .min(10, t("addCourse.validation.descEnRequired")),

    learnings: z
      .array(
        z.object({
          title_ar: z.string().min(3, t("addCourse.validation.featureTitleAr")),
          title_en: z.string().min(3, t("addCourse.validation.featureTitleEn")),
          description_ar: z
            .string()
            .min(5, t("addCourse.validation.featureDescAr")),
          description_en: z
            .string()
            .min(5, t("addCourse.validation.featureDescEn")),
        }),
      )
      .min(1, t("addCourse.validation.atLeastOneFeature")),

    duration: z
      .string()
      .min(1, t("addCourse.validation.durationRequired"))
      .regex(/^\d{2}:\d{2}$/, t("addCourse.validation.durationFormat")),

    price: requiredNumberSchema,
    dollar_price: requiredNumberSchema,

    price_before_discount: z.preprocess(
      (val) => Number(val),
      z.number().min(0, t("addCourse.validation.priceRequired")),
    ),

    dollar_price_before_discount: z.preprocess(
      (val) => Number(val),
      z.number().min(0, t("addCourse.validation.priceRequired")),
    ),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      category_id: "",
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "learnings",
  });

  // تشكيل وتجهيز البيانات من الـ API
  const formatCourseData = (data) => {
    if (!data) return {};
    return {
      category_id: String(data.category_id) || "",
      link: data.link || "",
      name_ar: data.name?.ar || "",
      name_en: data.name?.en || "",
      description_ar: data.description?.ar || "",
      description_en: data.description?.en || "",
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
      price:
        data.price !== undefined && data.price !== null
          ? String(data.price)
          : "",
      dollar_price:
        data.dollar_price !== undefined && data.dollar_price !== null
          ? String(data.dollar_price)
          : "",
      price_before_discount:
        data.price_before_discount !== undefined &&
        data.price_before_discount !== null
          ? String(data.price_before_discount)
          : "",
      dollar_price_before_discount:
        data.dollar_price_before_discount !== undefined &&
        data.dollar_price_before_discount !== null
          ? String(data.dollar_price_before_discount)
          : "",
    };
  };

  useEffect(() => {
    if (course) {
      reset(formatCourseData(course));
      if (course.image) {
        setImagePreview(course.image);
      }
    }
  }, [course, reset]);

  const {
    mutate: updateCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (formData) => updateCourse(formData, id),
    onSuccess: () => {
      toast.success(t("editCourse.success"));
      setIsEditing(false);
      queryClient.invalidateQueries(["myCourseDetails", id]);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("category_id", data.category_id);
    formData.append("name[en]", data.name_en);
    formData.append("name[ar]", data.name_ar);
    formData.append("description[en]", data.description_en);
    formData.append("description[ar]", data.description_ar);
    formData.append("price", data.price);
    formData.append("dollar_price", data.dollar_price);
    formData.append("price_before_discount", data.price_before_discount);
    formData.append(
      "dollar_price_before_discount",
      data.dollar_price_before_discount,
    );
    formData.append("duration", data.duration);

    if (data.link) {
      formData.append("link", data.link);
    }

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

    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateCourseMutate(formData);
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title={t("editCourse.title")} />

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-medium py-1.5 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm hover:bg-primary/5 transition-all"
          >
            <FaRegEdit className="w-4 h-4" />
            <span>{t("editCourse.editData")}</span>
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
            className={`w-full max-w-60 aspect-5/3 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden transition-all ${
              isEditing
                ? "cursor-pointer hover:bg-gray-100"
                : "cursor-not-allowed opacity-90"
            } ${errors.image ? "border-red-500" : "border-gray-200"}`}
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
                <span className="">{t("addCourse.courseImage")}</span>
              </div>
            )}
          </div>
        </div>

        {/* شجرة اختيار وتعديل الفئات التفاعلية المعتمدة على الـ category_chain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
          {renderLevels.map((level) => (
            <div key={level.levelIndex}>
              <label className="text-sm font-medium inline-block mb-2">
                {level.levelIndex === 0
                  ? t("coursesPage.mainCategory")
                  : level.parentName}
              </label>
              <Select
                disabled={categoriesLoading || level.disabled}
                value={level.selectedValue}
                onValueChange={(val) =>
                  handleCategoryChange(level.levelIndex, val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("coursesPage.categoryPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {!level.disabled && (
                      <SelectItem value="all">
                        {`${t("all")} ${level.parentName}`}
                      </SelectItem>
                    )}
                    {level.options?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* حقل الـ Category المخفي المربوط بـ react-hook-form */}
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <input type="hidden" name={field.name} value={field.value} />
          )}
        />
        {errors.category_id && (
          <p className="text-sm text-red-500 -mt-4">
            {errors.category_id.message}
          </p>
        )}

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
              label={t("addCourse.videoLink")}
              placeholder={t("addCourse.videoLinkPlaceholder")}
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
                label={t("addCourse.nameAr")}
                placeholder={t("addCourse.nameArPlaceholder")}
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
                label={t("addCourse.nameEn")}
                placeholder={t("addCourse.nameEnPlaceholder")}
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
                label={t("addCourse.descAr")}
                placeholder={t("addCourse.descArPlaceholder")}
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
                label={t("addCourse.descEn")}
                placeholder={t("addCourse.descEnPlaceholder")}
                error={errors.description_en?.message}
                type="textarea"
              />
            )}
          />
        </div>

        {/* قسم إضافة ميزات تعلم الكورس الديناميكي (learnings) */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("addCourse.learningsTitle")}
          </h3>

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
                  {t("addCourse.delete")}
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
                      label={t("addCourse.featureTitleAr")}
                      placeholder={t("addCourse.featureTitleArPlaceholder")}
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
                      label={t("addCourse.featureTitleEn")}
                      placeholder={t("addCourse.featureTitleEnPlaceholder")}
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
                      label={t("addCourse.featureDescAr")}
                      placeholder={t("addCourse.featureDescArPlaceholder")}
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
                      label={t("addCourse.featureDescEn")}
                      placeholder={t("addCourse.featureDescEnPlaceholder")}
                      error={errors.learnings?.[index]?.description_en?.message}
                      type="textarea"
                    />
                  )}
                />
              </div>
            </div>
          ))}

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
              {t("addCourse.addFeature")}
            </button>
          )}
          {errors.learnings?.message && (
            <p className="text-sm text-red-500 mt-2">
              {errors.learnings.message}
            </p>
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
              label={t("addCourse.duration")}
              placeholder={t("addCourse.durationPlaceholder")}
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
                label={t("addCourse.priceEg")}
                placeholder={t("addCourse.priceEgPlaceholder")}
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
                label={t("addCourse.priceUsd")}
                placeholder={t("addCourse.priceUsdPlaceholder")}
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
                label={t("addCourse.priceBeforeDiscountEg")}
                placeholder={t("addCourse.priceBeforeDiscountPlaceholder")}
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
                label={t("addCourse.priceBeforeDiscountUsd")}
                placeholder={t("addCourse.priceBeforeDiscountPlaceholder")}
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
              {isPending ? t("editCourse.saving") : t("editCourse.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40"
              onClick={() => {
                reset(formatCourseData(course));
                // إرجاع الأقسام لوضعها الأصلي عند الإلغاء
                if (course?.category_chain) {
                  setSelectedCategories(
                    course.category_chain.map((c) => String(c.id)),
                  );
                }
                setImagePreview(course?.image || null);
                setImageFile(null);
                setIsEditing(false);
              }}
            >
              {t("editCourse.cancel")}
            </Button>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <FormError
              errorMsg={error?.response?.data?.message || t("addCourse.error")}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default EditCourse;
