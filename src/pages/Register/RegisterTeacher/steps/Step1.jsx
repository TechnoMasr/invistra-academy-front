import MainInput from "@/components/form/MainInput";
import PhoneInputField from "@/components/form/PhoneInputField";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";

const Step1 = ({ setParentData, parentData, goNext }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const schema = z
    .object({
      name_ar: z.string().min(3, t("RegisterTeacherStep1.nameTooShort")),
      name_en: z.string().min(3, t("RegisterTeacherStep1.nameEnTooShort")),
      email: z.string().email(t("RegisterTeacherStep1.invalidEmail")),
      phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
        message: t("RegisterTeacherStep1.invalidPhone"),
      }),
      password: z.string().min(6, t("RegisterTeacherStep1.passwordMin")),
      password_confirmation: z
        .string()
        .min(6, t("RegisterTeacherStep1.confirmPassword")),
      terms_accepted: z.boolean().refine((val) => val === true, {
        message: t("RegisterTeacherStep1.termsRequired"),
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("RegisterTeacherStep1.passwordsMismatch"),
      path: ["password_confirmation"],
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name_ar: parentData.name_ar || "",
      name_en: parentData.name_en || "",
      email: parentData.email || "",
      phone: parentData.phone || "",
      password: parentData.password || "",
      password_confirmation: parentData.password_confirmation || "",
      terms_accepted: parentData.terms_accepted ? true : false,
    },
  });

  const onSubmit = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { terms_accepted, ...rest } = data;

    setParentData({
      ...parentData,
      ...rest,
      terms_accepted: 1,
      type: "company",
      image: imageFile,
    });

    goNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Image Upload */}
      <div className="flex flex-col items-center justify-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          id="image"
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
          className="w-20 aspect-square bg-muted rounded-full cursor-pointer 
                  flex items-center justify-center border-2 border-primary overflow-hidden"
        >
          {imagePreview ? (
            <img
              loading="lazy"
              src={imagePreview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <IoImageOutline className="text-muted-foreground text-4xl" />
          )}
        </div>

        <label
          htmlFor="image"
          className="font-semibold text-sm mt-1 cursor-pointer"
        >
          {t("RegisterTeacherStep1.uploadImage")}
        </label>
      </div>

      {/* Arabic Name */}
      <Controller
        name="name_ar"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            label={t("RegisterTeacherStep1.fullNameArabic")}
            placeholder={t("RegisterTeacherStep1.fullNameArabicPlaceholder")}
            error={errors.name_ar?.message}
          />
        )}
      />

      {/* English Name */}
      <Controller
        name="name_en"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            label={t("RegisterTeacherStep1.fullNameEnglish")}
            placeholder={t("RegisterTeacherStep1.fullNameEnglishPlaceholder")}
            error={errors.name_en?.message}
          />
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="email"
            label={t("RegisterTeacherStep1.email")}
            placeholder={t("RegisterTeacherStep1.emailPlaceholder")}
            error={errors.email?.message}
          />
        )}
      />

      {/* Phone */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInputField
            {...field}
            label={t("RegisterTeacherStep1.phone")}
            placeholder={t("RegisterTeacherStep1.phonePlaceholder")}
            error={errors.phone?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="password"
            label={t("RegisterTeacherStep1.password")}
            placeholder="************"
            error={errors.password?.message}
          />
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="password"
            label={t("RegisterTeacherStep1.confirmPassword")}
            placeholder="************"
            error={errors.password_confirmation?.message}
          />
        )}
      />

      {/* Terms */}
      <div>
        <Controller
          name="terms_accepted"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none flex items-center gap-1"
              >
                {t("RegisterTeacherStep1.agreeTo")}{" "}
                <span
                  className="text-sky-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(openModal({ modalName: "termsModal" }));
                  }}
                >
                  {t("RegisterTeacherStep1.termsAndConditions")}
                </span>
              </label>
            </div>
          )}
        />

        {errors.terms_accepted && (
          <p className="text-sm text-red-600 mt-1">
            {errors.terms_accepted.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-4">
        {t("RegisterTeacherStep1.continueNextStep")}
      </Button>
    </form>
  );
};

export default Step1;
