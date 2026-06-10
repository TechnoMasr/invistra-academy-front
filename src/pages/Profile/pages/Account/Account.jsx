import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { FaPen } from "react-icons/fa";
import { isValidPhoneNumber } from "react-phone-number-input";

import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/authServices";

import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { addUser } from "@/store/user/userSlice";
import { toast } from "sonner";
import { openModal } from "@/store/modals/modalsSlice";
import PhoneInputField from "@/components/form/PhoneInputField";

const Account = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = {
    name: "John Doe",
    email: "Hx9tH@example.com",
    phone: "+201234567898",
    image:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [avatar, setAvatar] = useState(user?.image || null);

  const fileInputRef = useRef(null);

  const accountSchema = z.object({
    name: z.string().min(2, t("account.form.name.validation.min")),
    email: z.string().email(t("account.form.email.validation.invalid")),
    phone: z
      .string()
      .refine(
        (val) => !val || isValidPhoneNumber(val),
        t("account.form.phone.validation.invalid"),
      )
      .optional()
      .or(z.literal("")),
    image: z.any().optional(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || null,
    },
    mode: "onChange",
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      dispatch(addUser(data));
      setErrorMsg("");
      setIsEditing(false);

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

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone || "");
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }
    updateProfileMutation.mutate(formData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
    setAvatar(user?.image || null);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md mx-auto"
        style={{
          pointerEvents: updateProfileMutation.isPending ? "none" : "auto",
        }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {isEditing && (
              <div
                className="absolute bottom-0 inset-s-0 w-8 h-8 bg-primary rounded-full border border-white z-10 cursor-pointer flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPen size={16} className="text-white" />
              </div>
            )}

            <UserAvatar name={user?.name} image={avatar} size={150} />

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
        </div>

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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          )}
        />

        {/* Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={() =>
              isEditing ? handleCancelEdit() : setIsEditing(true)
            }
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing
              ? t("account.buttons.cancelEdit")
              : t("account.buttons.edit")}
          </Button>

          {isEditing ? (
            <Button type="submit" className="flex-1">
              {updateProfileMutation.isPending
                ? t("account.buttons.saving")
                : t("account.buttons.save")}
            </Button>
          ) : (
            <Button
              className="flex-1"
              type="button"
              variant="outline"
              onClick={() =>
                dispatch(openModal({ modalName: "changePasswordModal" }))
              }
            >
              {t("account.buttons.changePassword")}
            </Button>
          )}
        </div>

        {errorMsg && <FormError errorMsg={errorMsg} />}
      </form>
    </div>
  );
};

export default Account;
