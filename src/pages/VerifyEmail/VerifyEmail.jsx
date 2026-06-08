import { useEffect, useState } from "react";
import AuthContainer from "@/components/form/AuthContainer";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router";
import { z } from "zod";

import FormError from "@/components/form/FormError";
import { sendOtpVerifyEmail, verifyEmail } from "@/api/verifyEmailServices";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser } from "@/store/user/userSlice";
import { logoutAction } from "@/store/user/userActions";
import { useTranslation } from "react-i18next";

const otpSchema = z.object({
  otp: z.string().length(6, "otpError"),
});

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const timerNum = 60; // 60 seconds for OTP resend
  const [countdown, setCountdown] = useState(timerNum);
  const [otpSent, setOtpSent] = useState(false);

  /* ================== Send OTP ================== */
  const { mutate: sendOtpMutation, isPending: isSending } = useMutation({
    mutationFn: (email) => sendOtpVerifyEmail(email),
    onSuccess: () => {
      setCountdown(timerNum);
      setOtpSent(true);
    },
  });

  useEffect(() => {
    if (user?.email && !otpSent) {
      sendOtpMutation(user.email);
    }
  }, [user?.email, otpSent]);

  /* ================== Verify ================== */
  const {
    mutate: verifyEmailMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email, code }) => verifyEmail({ email, code }),
    onSuccess: (data) => {
      dispatch(addUser(data?.user));
      navigate("/", { replace: true });
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
    verifyEmailMutation({
      email: user?.email,
      code: data.otp,
    });
  };

  const handleResend = () => {
    sendOtpMutation(user?.email);
  };

  const handleBackToRegister = () => {
    dispatch(logoutAction());
    dispatch(clearUser());
    navigate(`/register`, { replace: true });
  };

  return (
    <AuthContainer
      title={t("verifyEmailPage.title")}
      description={t("verifyEmailPage.description")}
    >
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
                <InputOTPGroup className="gap-2 lg:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="text-xl rounded-full! w-10 h-10 border border-primary bg-white text-black"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {errors.otp && (
                <p className="text-sm text-red-600 text-center">
                  {t(`verifyEmailPage.${errors.otp.message}`)}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? t("verifyEmailPage.checking")
            : t("verifyEmailPage.verifyButton")}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          {t("verifyEmailPage.didntReceive")}
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isSending}
            className={`text-primary hover:underline cursor-pointer ms-1 ${
              countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {countdown > 0
              ? t("verifyEmailPage.resendIn", { seconds: countdown })
              : t("verifyEmailPage.resend")}
          </button>
        </p>

        <button
          type="button"
          onClick={handleBackToRegister}
          className="text-sm hover:underline cursor-pointer text-muted-foreground"
        >
          {t("verifyEmailPage.backToRegister")}
        </button>

        {error && (
          <FormError
            errorMsg={
              error.response?.data?.message || t("verifyEmailPage.invalidOtp")
            }
          />
        )}
      </form>
    </AuthContainer>
  );
};

export default VerifyEmail;
