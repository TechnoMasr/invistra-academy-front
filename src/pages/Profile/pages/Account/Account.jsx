import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import MainInput from "@/components/form/MainInput";
import PhoneInputField from "@/components/form/PhoneInputField";
import FormError from "@/components/form/FormError";

import { FaPen } from "react-icons/fa";
import { isValidPhoneNumber } from "react-phone-number-input";

import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/authServices";

import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { addUser } from "@/store/user/userSlice";
import { toast } from "sonner";
import { openModal } from "@/store/modals/modalsSlice";

const Account = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [avatar, setAvatar] = useState(user?.image || null);

  const fileInputRef = useRef(null);

  /* ---------------- schema ---------------- */
  const accountSchema = z.object({
    name: z.string().min(2, t("account.form.name.validation.min")),
    email: z.string().email(t("account.form.email.validation.invalid")),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidPhoneNumber(val),
        t("account.form.phone.validation.invalid"),
      ),

    // ✅ الجديد
    emirate_id: z.string().optional(), // أو .min(1, ...) لو عايزها required
    city: z.string().optional(), // أو .min(1, ...) لو required

    image: z.any().optional(),
  });

  /* ---------------- form ---------------- */
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      emirate_id: String(user?.emirate_id || ""),
      city: user?.city || "", // ✅
      image: user?.image || null,
    },
    mode: "onChange",
  });

  /* ---------------- mutation ---------------- */
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      dispatch(addUser(data));
      setErrorMsg("");

      // تحديث الفورم بالقيم الجديدة
      reset({
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        image: data?.image,
      });

      setAvatar(data?.image);

      toast.success(t("account.messages.success"));
    },
    onError: (error) => {
      setErrorMsg(error?.response?.data?.message);
    },
  });

  const image = watch("image");

  const { emirates } = useSelector((state) => state.emirates);

  /* ---------------- submit ---------------- */
  const onSubmit = (values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone || "");
    formData.append("emirate_id", values.emirate_id || "");
    formData.append("city", values.city || "");

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* ===== Form Card ===== */}
      <div
        style={{
          pointerEvents: updateProfileMutation.isPending ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div
              className="absolute bottom-0 inset-s-0 w-8 h-8 bg-primary rounded-full z-10 cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaPen size={16} className="text-white" />
            </div>

            <UserAvatar name={user?.name} image={avatar} size={100} />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setValue("image", file, { shouldDirty: true });
                  const reader = new FileReader();
                  reader.onload = () => setAvatar(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <h3 className="text-2xl ">{t("account.personalInfo")}</h3>
        </div>

        {/* ===== Form ===== */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md mx-auto"
        >
          {/* Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.name.label")}
                placeholder={t("account.form.name.placeholder")}
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
                label={t("account.form.email.label")}
                placeholder={t("account.form.email.placeholder")}
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
                label={t("account.form.phone.label")}
                error={errors.phone?.message}
              />
            )}
          />

          {/* Country */}
          <Controller
            name="emirate_id"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="select"
                options={emirates.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                label={t("account.form.country.label")}
                placeholder={t("account.form.country.placeholder")}
                error={errors.emirate_id?.message}
              />
            )}
          />

          {/* City */}
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.city.label")}
                placeholder={t("account.form.city.placeholder")}
                error={errors.city?.message}
              />
            )}
          />

          {/* Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={updateProfileMutation.isPending || !isDirty}
            >
              {updateProfileMutation.isPending
                ? t("account.buttons.saving")
                : t("account.buttons.save")}
            </Button>

            <Button
              className={`flex-1`}
              type="button"
              variant="outline"
              onClick={() =>
                dispatch(openModal({ modalName: "changePasswordModal" }))
              }
            >
              {t("account.buttons.changePassword")}
            </Button>
          </div>

          {errorMsg && <FormError errorMsg={errorMsg} />}
        </form>
      </div>
    </div>
  );
};

export default Account;
