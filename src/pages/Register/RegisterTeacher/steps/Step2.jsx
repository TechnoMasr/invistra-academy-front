import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { registerUser, googleCompleteInstructor } from "@/api/authServices";
import { useMutation } from "@tanstack/react-query";
import FormError from "@/components/form/FormError";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// إضافة goBack في الـ props
const Step2 = ({ setParentData, parentData, goNext, goBack }) => {
  const { t } = useTranslation();

  const isGoogleFlow = Boolean(parentData?.id_token);

  const schema = z.object({
    job_title_ar: z
      .string()
      .min(3, t("RegisterTeacherStep2.validation.jobTitleAr")),

    job_title_en: z
      .string()
      .min(3, t("RegisterTeacherStep2.validation.jobTitleEn")),

    bio_ar: z.string().min(5, t("RegisterTeacherStep2.validation.bioAr")),

    bio_en: z.string().min(5, t("RegisterTeacherStep2.validation.bioEn")),

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
    mutationFn: isGoogleFlow ? googleCompleteInstructor : registerUser,
    onSuccess: () => {
      goNext();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
      console.log(err);
    },
  });

  const onSubmit = (data) => {
    const finalData = { ...parentData, ...data };
    setParentData(finalData);

    if (isGoogleFlow) {
      const googlePayload = {
        id_token: finalData.id_token,
        type: "instructor",
        name: {
          ar: finalData.name,
          en: finalData.name,
        },
        job_title: {
          ar: finalData.job_title_ar,
          en: finalData.job_title_en,
        },
        bio: {
          ar: finalData.bio_ar,
          en: finalData.bio_en,
        },
        category_id: Number(finalData.category_id),
      };

      mutate(googlePayload);
    } else {
      const formData = new FormData();

      if (finalData.image) {
        formData.append("image", finalData.image);
      }

      formData.append("email", finalData.email);
      formData.append("phone", finalData.phone);
      formData.append("password", finalData.password);
      formData.append("password_confirmation", finalData.password_confirmation);
      formData.append("category_id", String(finalData.category_id));
      formData.append("terms_accepted", "1");
      formData.append("type", "instructor");

      formData.append("name", finalData.name_en);
      formData.append("job_title", finalData.job_title_en);
      formData.append("bio", finalData.bio_en);

      formData.append("name[ar]", finalData.name_ar);
      formData.append("name[en]", finalData.name_en);

      formData.append("job_title[ar]", finalData.job_title_ar);
      formData.append("job_title[en]", finalData.job_title_en);

      formData.append("bio[ar]", finalData.bio_ar);
      formData.append("bio[en]", finalData.bio_en);

      mutate(formData);
    }
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

      {/* أزرار التحكم: العودة والإكمال */}
      <div className="flex gap-2 items-center mt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goBack}
          disabled={isPending}
        >
          {t("RegisterTeacherStep2.back")}
        </Button>

        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending
            ? t("RegisterTeacherStep2.creating")
            : t("RegisterTeacherStep2.completeRegistration")}
        </Button>
      </div>

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
