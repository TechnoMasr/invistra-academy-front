import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { registerUser } from "@/api/authServices";
import { useMutation } from "@tanstack/react-query";
import FormError from "@/components/form/FormError";
import { useSelector } from "react-redux";

const Step2 = ({ setParentData, parentData, goNext }) => {
  const { t } = useTranslation();

  const schema = z.object({
    job_title_ar: z
      .string()
      .min(3, t("RegisterTeacherStep2.validation.jobTitleAr")),

    job_title_en: z
      .string()
      .min(3, t("RegisterTeacherStep2.validation.jobTitleEn")),

    bio_ar: z.string().min(10, t("RegisterTeacherStep2.validation.bioAr")),

    bio_en: z.string().min(10, t("RegisterTeacherStep2.validation.bioEn")),

    category_id: z
      .string()
      .min(1, t("RegisterTeacherStep2.validation.department")),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      job_title_ar: parentData.job_title_ar || "",
      job_title_en: parentData.job_title_en || "",
      bio_ar: parentData.bio_ar || "",
      bio_en: parentData.bio_en || "",
      category_id: parentData.category_id || "",
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      goNext();
    },
  });

  const onSubmit = (data) => {
    const finalData = { ...parentData, ...data };

    setParentData(finalData);

    const formData = new FormData();

    // 1. إرسال الصورة إذا كانت موجودة
    if (finalData.image) {
      formData.append("image", finalData.image);
    }

    // 2. إرسال الحقول الأساسية
    formData.append("email", finalData.email);
    formData.append("phone", finalData.phone);
    formData.append("password", finalData.password);
    formData.append("password_confirmation", finalData.password_confirmation);
    formData.append("category_id", String(finalData.category_id));
    formData.append("terms_accepted", "1");
    formData.append("type", "instructor"); // تأكد إذا كانت instructor أو company بناءً على المطلوب

    // 3. إرسال الحقول متعددة اللغات بالصيغة التي يفهمها Laravel للـ Objects/Arrays
    // الحقول العامة (إذا كان الـ backend يطلبها كـ fallback أو كـ string)
    formData.append("name", finalData.name_en); // أو name_ar حسب رغبتك
    formData.append("job_title", finalData.job_title_en);
    formData.append("bio", finalData.bio_en);

    // الحقول الفرعية المحددة للغات (Laravel يفهم صيغة القوسين [] لتركيب الـ Arrays المتداخلة)
    formData.append("name[ar]", finalData.name_ar);
    formData.append("name[en]", finalData.name_en);

    formData.append("job_title[ar]", finalData.job_title_ar);
    formData.append("job_title[en]", finalData.job_title_en);

    formData.append("bio[ar]", finalData.bio_ar);
    formData.append("bio[en]", finalData.bio_en);

    mutate(formData);
  };

  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Job Title AR */}
      <Controller
        name="job_title_ar"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            label={t("RegisterTeacherStep2.jobTitleAr")}
            placeholder={t("RegisterTeacherStep2.jobTitleArPlaceholder")}
            error={errors.job_title_ar?.message}
          />
        )}
      />

      {/* Job Title EN */}
      <Controller
        name="job_title_en"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            label={t("RegisterTeacherStep2.jobTitleEn")}
            placeholder={t("RegisterTeacherStep2.jobTitleEnPlaceholder")}
            error={errors.job_title_en?.message}
          />
        )}
      />

      {/* Bio AR */}
      <Controller
        name="bio_ar"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="textarea"
            label={t("RegisterTeacherStep2.bioAr")}
            placeholder={t("RegisterTeacherStep2.bioArPlaceholder")}
            error={errors.bio_ar?.message}
          />
        )}
      />

      {/* Bio EN */}
      <Controller
        name="bio_en"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="textarea"
            label={t("RegisterTeacherStep2.bioEn")}
            placeholder={t("RegisterTeacherStep2.bioEnPlaceholder")}
            error={errors.bio_en?.message}
          />
        )}
      />

      {/* Department */}
      <Controller
        name="category_id"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="select"
            disabled={categoriesLoading}
            label={t("RegisterTeacherStep2.department")}
            placeholder={t("RegisterTeacherStep2.departmentPlaceholder")}
            options={
              categories &&
              categories.map((option) => ({
                value: String(option.id),
                label: option.name,
              }))
            }
            error={errors.category_id?.message}
          />
        )}
      />

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending
          ? t("RegisterTeacherStep2.creating")
          : t("RegisterTeacherStep2.completeRegistration")}
      </Button>

      {error && (
        <FormError
          errorMsg={
            error?.response?.data?.message ||
            t("RegisterTeacherStep3.somethingWentWrong")
          }
        />
      )}
    </form>
  );
};

export default Step2;
