import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import { createCourse } from "@/api/myCoursesServices";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useSelector } from "react-redux";

// استيراد مكونات الـ Select
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddCourse = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthGuard();

  // جلب الفئات المتاحة من Redux لتتبع الفئات الفرعية
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  // تتبع مسار الفئات الفرعية المختارة من قبل المستخدم في الـ State
  // نبدأ بمصفوفة تحتوي على القسم الرئيسي الخاص بالمستخدم لمنع تعديله
  const [selectedCategories, setSelectedCategories] = useState([]);

  // تحديث القسم الرئيسي تلقائياً فور توفر بيانات المستخدم
  useEffect(() => {
    if (user?.category?.id) {
      setSelectedCategories([String(user.category.id)]);
    }
  }, [user?.category?.id]);

  // بناء قائمة المستويات المتاحة للعرض ديناميكياً
  const renderLevels = [];
  let currentLevelOptions = categories || [];

  // المستوى الأول (القسم الرئيسي للمدرس)
  if (user?.category?.id) {
    const mainCategoryObj = currentLevelOptions.find(
      (cat) => String(cat.id) === String(user.category.id),
    );

    renderLevels.push({
      levelIndex: 0,
      options: currentLevelOptions,
      selectedValue: String(user.category.id),
      disabled: true, // معطل دائماً بناءً على طلبك
      parentName: "",
    });

    // بناء القوائم الفرعية المتتالية إذا اختار المستخدم مستويات أدنى
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
            disabled: false,
            parentName: foundParent.name,
          });
        } else {
          break;
        }
      }
    }
  }

  // التعامل مع تغيير قيم الفئات الفرعية
  const handleCategoryChange = (levelIndex, value) => {
    if (value === "all") {
      // إذا اختار "الكل" نعود إلى مسار الأب فقط
      setSelectedCategories(selectedCategories.slice(0, levelIndex));
    } else {
      // تحديث المسار بإضافة العنصر الجديد وحذف الفروع التالية له
      const newPath = [...selectedCategories.slice(0, levelIndex)];
      newPath[levelIndex] = value;
      setSelectedCategories(newPath);
    }
  };

  // الـ ID الفعلي والنهائي المختار لإرساله للـ API (آخر عنصر نشط في المصفوفة)
  const activeCategoryId =
    selectedCategories[selectedCategories.length - 1] || user?.category?.id;

  // التحقق من صحة المدخلات (Zod)
  const requiredNumberSchema = z
    .string()
    .min(1, t("addCourse.validation.priceRequired"))
    .refine(
      (val) => !isNaN(Number(val)),
      t("addCourse.validation.priceRequired"),
    )
    .transform((val) => Number(val))
    .refine((val) => val >= 0, t("addCourse.validation.priceRequired"));

  const courseSchema = z.object({
    link: z
      .string()
      .url(t("addCourse.validation.invalidLink"))
      .optional()
      .or(z.literal("")),
    image: z.any().refine((file) => file instanceof File, {
      message: t("addCourse.validation.imageRequired"),
    }),
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
      link: "",
      image: null,
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      learnings: [
        { title_ar: "", title_en: "", description_ar: "", description_en: "" },
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

  const {
    mutate: createCourseMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      reset();
      setImagePreview(null);
      if (user?.category?.id) setSelectedCategories([String(user.category.id)]);
      toast.success(t("addCourse.success"));
      navigate("/profile/my-courses");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

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

    // إرسال الـ category_id النهائي للشجرة النشطة
    if (activeCategoryId) {
      formData.append("category_id", activeCategoryId);
    }

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

    if (data.image) {
      formData.append("image", data.image);
    }

    createCourseMutate(formData);
  };

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("addCourse.title")} />

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
                setValue("image", file, { shouldValidate: true });
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current.click()}
            className={`w-full max-w-60 aspect-5/3 bg-gray-50 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-all ${
              errors.image ? "border-red-500" : "border-gray-200"
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
                <span>{t("addCourse.courseImage")}</span>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500 mt-2">{errors.image.message}</p>
          )}
        </div>

        {/* شجرة اختيار الفئات ديناميكياً */}
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
                <SelectTrigger className="w-full bg-accent">
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

        {/* حقل الفيديو التعريفي (link) */}
        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <MainInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              label={t("addCourse.videoLink")}
              placeholder={t("addCourse.videoLinkPlaceholder")}
              error={errors.link?.message}
            />
          )}
        />

        {/* اسم الكورس وعناوين الوصف وباقي الحقول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
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
                label={t("addCourse.nameEn")}
                placeholder={t("addCourse.nameEnPlaceholder")}
                error={errors.name_en?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="description_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
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
                label={t("addCourse.descEn")}
                placeholder={t("addCourse.descEnPlaceholder")}
                error={errors.description_en?.message}
                type="textarea"
              />
            )}
          />
        </div>

        {/* قسم الـ learnings */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("addCourse.learningsTitle")}
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
                  className="ms-auto text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition-all cursor-pointer"
                >
                  {t("addCourse.delete")}
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`learnings.${index}.title_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
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
                      label={t("addCourse.featureTitleEn")}
                      placeholder={t("addCourse.featureTitleEnPlaceholder")}
                      error={errors.learnings?.[index]?.title_en?.message}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`learnings.${index}.description_ar`}
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
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
        </div>

        {/* مدة الكورس وأسعاره */}
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <MainInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              type="text"
              label={t("addCourse.duration")}
              placeholder={t("addCourse.durationPlaceholder")}
              error={errors.duration?.message}
            />
          )}
        />

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
                type="number"
                label={t("addCourse.priceUsd")}
                placeholder={t("addCourse.priceUsdPlaceholder")}
                error={errors.dollar_price?.message}
              />
            )}
          />
        </div>

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
                type="number"
                label={t("addCourse.priceBeforeDiscountUsd")}
                placeholder={t("addCourse.priceBeforeDiscountPlaceholder")}
                error={errors.dollar_price_before_discount?.message}
              />
            )}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 items-center">
          <Button type="submit" className="w-full md:w-60" disabled={isPending}>
            {isPending ? t("addCourse.saving") : t("addCourse.save")}
          </Button>
          {error && (
            <FormError
              errorMsg={error?.response?.data?.message || t("addCourse.error")}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
