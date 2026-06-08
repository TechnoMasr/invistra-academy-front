import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";
import { Button } from "@/components/ui/button";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Link } from "react-router";
import { z } from "zod";
import { sendOtp } from "@/api/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const CheckEmail = ({ goNext, setParentData }) => {
  const { t } = useTranslation();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t("checkEmail.invalidEmail")),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: sendOtpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email }) => sendOtp(email),
    onSuccess: (data, variables) => {
      setParentData({ email: variables.email });
      goNext();
    },
  });

  const onSubmit = (data) => {
    sendOtpMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <MainInput
            {...field}
            type="email"
            label={t("checkEmail.emailLabel")}
            placeholder={t("checkEmail.emailPlaceholder")}
            error={errors.email?.message}
          />
        )}
      />

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending ? t("checkEmail.sending") : t("checkEmail.sendResetLink")}
      </Button>

      <p className="text-sm text-center">
        {t("checkEmail.rememberPassword")}
        <Link
          to="/login"
          className="text-sky-600 cursor-pointer hover:underline"
        >
          {" "}
          {t("checkEmail.login")}
        </Link>
      </p>

      {error && (
        <FormError
          errorMsg={
            error.response?.data?.message || t("checkEmail.genericError")
          }
        />
      )}
    </form>
  );
};

export default CheckEmail;
