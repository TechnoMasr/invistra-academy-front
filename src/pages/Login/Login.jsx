import AuthContainer from "@/components/form/AuthContainer";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import FormError from "@/components/form/FormError";
import { useMutation } from "@tanstack/react-query";
import { loginUser, googleAuthenticate } from "@/api/authServices"; // استيراد الـ API الخاص بجوجل
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { setCredentials } from "@/store/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google"; // استيراد مكون جوجل

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Dynamic Schema
  const loginSchema = z.object({
    email: z.string().email(t("login.invalidEmail")),
    password: z.string().min(6, t("login.passwordMin")),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 1. Mutation التسجيل التقليدي
  const {
    mutate: loginMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      navigate("/");
      dispatch(
        setCredentials({
          user: data.user,
        }),
      );
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Login failed!");
      console.log("Login Error:", err);
    },
  });

  // 2. Mutation تسجيل الدخول عبر Google
  const {
    mutate: googleMutate,
    isPending: isGooglePending,
    error: googleError,
  } = useMutation({
    mutationFn: googleAuthenticate,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
        }),
      );
      navigate("/", { replace: true });
      toast.success(t("login.success") || "Logged in successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Google Login failed!");
      console.log("Google Login Error:", err);
    },
  });

  const onSubmit = (data) => {
    loginMutate(data);
  };

  return (
    <AuthContainer
      title={t("login.title")}
      description={t("login.description")}
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="email"
              label={t("login.labels.email")}
              placeholder={t("login.placeholders.email")}
              error={errors.email?.message}
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
              label={t("login.labels.password")}
              placeholder={t("login.placeholders.password")}
              error={errors.password?.message}
            />
          )}
        />

        <Link
          to={"/forgot-password"}
          className="inline-block ms-auto text-sm text-sky-600 cursor-pointer hover:underline"
        >
          {t("login.forgotPassword")}
        </Link>

        {/* زر تسجيل الدخول العادي */}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isPending || isGooglePending}
        >
          {isPending ? t("login.loggingIn") : t("login.loginButton")}
        </Button>

        {/* خط فاصل بين تسجيل الدخول العادي وجوجل */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase">
            {t("or")}
          </span>
          <div className="flex-grow border-t border-muted"></div>
        </div>

        {/* زر تسجيل الدخول بجوجل */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const formData = new FormData();
              formData.append("id_token", credentialResponse.credential);

              // نضرب الـ API مباشرة بالتوكن المستلم
              googleMutate(formData);
            }}
            onError={() => {
              toast.error("Google Sign-In Failed");
            }}
            theme="outline"
            size="large"
            width="100%"
            disabled={isPending || isGooglePending}
          />
        </div>
      </form>

      {/* عرض الأخطاء إن وجدت */}
      {(error || googleError) && (
        <FormError
          errorMsg={
            error?.response?.data?.message ||
            googleError?.response?.data?.message ||
            "Something went wrong"
          }
        />
      )}

      <div className="text-center text-sm mt-4">
        {t("login.noAccount")}{" "}
        <Link to="/register" className="text-sky-600 hover:underline">
          {t("login.createAccount")}
        </Link>
      </div>
    </AuthContainer>
  );
};

export default Login;
