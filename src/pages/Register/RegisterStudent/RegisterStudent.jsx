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
import { registerUser, googleAuthenticate } from "@/api/authServices"; // استيراد الدالتين
import FormError from "@/components/form/FormError";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";
import { setCredentials } from "@/store/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google"; // الـ hook الرسمي من المكتبة
import { toast } from "sonner";

const RegisterStudent = () => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // مخطط التحقق (Validation Schema) للـ Form العادي
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

  // 1. Mutation الخاص بالتسجيل التقليدي
  const {
    mutate: registerMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user }));
      navigate("/verify-email", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });

  // 2. Mutation الخاص بالتسجيل عبر Google (الذي يضرب الـ API المطلوبة)
  const {
    mutate: googleMutate,
    isPending: isGooglePending,
    error: googleError,
  } = useMutation({
    mutationFn: googleAuthenticate,
    onSuccess: (data) => {
      // حفظ بيانات المستخدم في Redux بعد نجاح المصادقة
      dispatch(
        setCredentials({
          user: data.user,
        }),
      );
      // التوجيه إلى الصفحة الرئيسية مباشرة لأن الحساب موثق تلقائياً من جوجل
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.log(error);
    },
  });

  // معالجة الـ Submit للـ Form العادي
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
        {/* حقل رفع الصورة الشخصية وتثبيتها بالمعاينة */}
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
            className="w-32 aspect-square bg-muted rounded-full cursor-pointer 
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

        {/* الحقول النصية للنموذج العادي */}
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

        {/* الموافقة على الشروط والأحكام */}
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

        {/* زر التسجيل العادي بالبريد وكلمة المرور */}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isPending || isGooglePending}
        >
          {isPending
            ? t("RegisterStudent.creating")
            : t("RegisterStudent.createAccount")}
        </Button>

        {/* خط فاصل مرئي بين نموذج التسجيل العادي وزر جوجل */}
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-muted"></div>
          <span className="shrink mx-4 text-muted-foreground text-xs uppercase">
            {t("or")}
          </span>
          <div className="grow border-t border-muted"></div>
        </div>

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const formData = new FormData();

              // هنا الـ id_token الحقيقي المكون من 3 أجزاء
              formData.append("id_token", credentialResponse.credential);
              formData.append("type", "student");

              // ضرب الـ API
              googleMutate(formData);
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
            theme="outline"
            size="large"
            width="100%"
            className="w-full flex justify-center"
          />
        </div>

        {/* إظهار رسائل الخطأ من الـ API سواء للتسجيل العادي أو جوجل */}
        {(error || googleError) && (
          <FormError
            errorMsg={
              error?.response?.data?.message ||
              googleError?.response?.data?.message ||
              t("RegisterStudent.somethingWentWrong")
            }
          />
        )}
      </form>
    </AuthContainer>
  );
};

export default RegisterStudent;
