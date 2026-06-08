import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Link } from "react-router";
import { z } from "zod";

import FormError from "@/components/form/FormError";
import { verifyOtp, resendOtp } from "@/api/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const otpSchema = z.object({
  otp: z.string().length(6, "otpRequired"),
});

const OTP = ({ goNext, parentData, setParentData }) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const timerNum = 60;
  const [countdown, setCountdown] = useState(timerNum);

  /* ================== Verify OTP ================== */
  const {
    mutate: verifyOtpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ code, email }) => verifyOtp({ code, email }),
    onSuccess: (data) => {
      setParentData((prev) => ({
        ...prev,
        otp: getValues("otp"),
        reset_token: data.reset_token,
      }));

      goNext();
    },
  });

  /* ================== Resend OTP ================== */
  const { mutate: resendOtpMutation, isPending: isResending } = useMutation({
    mutationFn: (email) => resendOtp(email),
    onSuccess: () => {
      setCountdown(timerNum);
    },
  });

  /* ================== Countdown ================== */
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /* ================== Handlers ================== */
  const onSubmit = (data) => {
    verifyOtpMutation({
      code: data.otp,
      email: parentData.email,
    });
  };

  const handleResend = () => {
    resendOtpMutation(parentData.email);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-6 items-center"
      dir="ltr"
    >
      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              containerClassName="justify-center"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="text-xl rounded-full! w-10 h-10 border"
                  />
                ))}
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup className="gap-2">
                {[3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="text-xl rounded-full! w-10 h-10 border"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {errors.otp && (
              <p className="text-sm text-red-600 text-center">
                {t(`otp.${errors.otp.message}`)}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending ? t("otp.verifying") : t("otp.confirm")}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        {t("otp.notReceived")}
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className={`text-sky-600 hover:underline cursor-pointer ms-1 ${
            countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {countdown > 0 ? t("otp.resendIn", { countdown }) : t("otp.resend")}
        </button>
      </p>

      <Link
        to="/login"
        className="text-sm hover:underline cursor-pointer text-sky-600"
      >
        {t("otp.backToLogin")}
      </Link>

      {error && (
        <FormError
          errorMsg={error?.response?.data?.message || t("otp.wrongOtp")}
        />
      )}
    </form>
  );
};

export default OTP;
