import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { registerUser } from "@/api/authServices";
import { useMutation } from "@tanstack/react-query";
import FormError from "@/components/form/FormError";

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

    department: z
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
      department: parentData.department || "",
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

    Object.keys(finalData).forEach((key) => {
      if (key === "image") {
        if (finalData.image) {
          formData.append("image", finalData.image);
        }
      } else {
        formData.append(key, finalData[key]);
      }
    });

    formData.append("terms_accepted", 1);
    formData.append("type", "company");

    // mutate(formData);
    goNext();
  };

  const departmentOptions = [
    {
      value: "marketing",
      label: t("RegisterTeacherStep2.departments.marketing"),
    },
    {
      value: "sales",
      label: t("RegisterTeacherStep2.departments.sales"),
    },
    {
      value: "it",
      label: t("RegisterTeacherStep2.departments.it"),
    },
  ];

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
        name="department"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="select"
            label={t("RegisterTeacherStep2.department")}
            placeholder={t("RegisterTeacherStep2.departmentPlaceholder")}
            options={departmentOptions}
            error={errors.department?.message}
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
