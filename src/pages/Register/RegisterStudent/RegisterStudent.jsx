import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import PhoneInputField from "@/components/form/PhoneInputField";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import { IoImageOutline } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/authServices";
import FormError from "@/components/form/FormError";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";
import { setCredentials } from "@/store/auth/authSlice";

const RegisterStudent = () => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const registerSchema = z
    .object({
      name: z.string().min(3, t("RegisterStudent.nameTooShort")),
      email: z.string().email(t("RegisterStudent.invalidEmail")),
      phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
        message: t("RegisterStudent.invalidPhone"),
      }),

      password: z.string().min(6, t("RegisterStudent.passwordMin")),
      password_confirmation: z
        .string()
        .min(6, t("RegisterStudent.confirmPassword")),
      terms_accepted: z.boolean().refine((val) => val === true, {
        message: t("RegisterStudent.termsRequired"),
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("RegisterStudent.passwordsMismatch"),
      path: ["password_confirmation"],
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      terms_accepted: false,
    },
  });
  const dispatch = useDispatch();

  const {
    mutate: registerMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
        }),
      );
      // OtpRoute هتوجهه أوتوماتيك لأن isEmailVerified = false
      navigate("/verify-email", { replace: true });
    },
  });

  const onSubmit = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { terms_accepted, ...payload } = data;

    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    formData.append("terms_accepted", 1);
    formData.append("type", "student");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    registerMutate(formData);
  };

  return (
    <AuthContainer
      title={t("RegisterStudent.createAccount")}
      description={t("RegisterStudent.enterDetails")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            {t("RegisterStudent.uploadImage")}
          </label>
        </div>

        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label={t("RegisterStudent.fullName")}
              placeholder={t("RegisterStudent.fullNamePlaceholder")}
              error={errors.name?.message}
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
              label={t("RegisterStudent.email")}
              placeholder={t("RegisterStudent.emailPlaceholder")}
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
              label={t("RegisterStudent.phone")}
              placeholder={t("RegisterStudent.phonePlaceholder")}
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
              label={t("RegisterStudent.password")}
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
              label={t("RegisterStudent.confirmPassword")}
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
                  className="text-sm  leading-none flex items-center gap-1"
                >
                  {t("RegisterStudent.agreeTo")}{" "}
                  <span
                    className="text-sky-600 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(openModal({ modalName: "termsModal" }));
                    }}
                  >
                    {t("RegisterStudent.termsAndConditions")}
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

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending
            ? t("RegisterStudent.creating")
            : t("RegisterStudent.createAccount")}
        </Button>

        {error && (
          <FormError
            errorMsg={
              error?.response?.data?.message ||
              t("RegisterStudent.somethingWentWrong")
            }
          />
        )}
      </form>
    </AuthContainer>
  );
};

export default RegisterStudent;
