import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { useMemo } from "react";
import { getPasswordStrength, strengthLabel } from "@/utils/PasswordStrength";

import { z } from "zod";
import { useNavigate } from "react-router";
import { resetPassword } from "@/api/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = ({ parentData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ⚡ Zod Schema مع الترجمة
  const resetPasswordSchema = z
    .object({
      password: z.string().min(6, t("resetPassword.minLength")),
      password_confirmation: z.string().min(6, t("resetPassword.minLength")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("resetPassword.mismatch"),
      path: ["password_confirmation"],
    });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const {
    mutate: resetPasswordMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload) => resetPassword(payload),
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (data) => {
    resetPasswordMutation({
      reset_token: parentData.reset_token,
      code: parentData.otp,
      email: parentData.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  const progressColor =
    strength <= 1
      ? "#ef4444"
      : strength === 2
        ? "#fbbf24"
        : strength === 3
          ? "#84cc16"
          : "#22c55e";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && (
        <FormError
          errorMsg={
            error.response?.data?.message || t("resetPassword.genericError")
          }
        />
      )}

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="password"
            label={t("resetPassword.newPassword")}
            placeholder="************"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="password"
            label={t("resetPassword.confirmPassword")}
            placeholder="************"
            error={errors.password_confirmation?.message}
          />
        )}
      />

      {/* Password Strength */}
      <div className="space-y-1">
        <Progress
          value={(strength / 4) * 100}
          indicatorColor={progressColor}
          className="bg-accent"
        />

        {strength > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("resetPassword.passwordStrength")}
            <span
              className="font-semibold ms-1"
              style={{ color: progressColor }}
            >
              {strengthLabel(strength)}
            </span>
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending
          ? t("resetPassword.resetting")
          : t("resetPassword.saveNewPassword")}
      </Button>
    </form>
  );
};

export default ResetPasswordPage;
