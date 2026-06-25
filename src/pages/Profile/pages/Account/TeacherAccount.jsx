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

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { openModal } from "@/store/modals/modalsSlice";
import PhoneInputField from "@/components/form/PhoneInputField";
import { setCredentials } from "@/store/auth/authSlice";

const TeacherAccount = ({ user }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [avatar, setAvatar] = useState(user?.image || null);
  const [savedData, setSavedData] = useState(user); // ✅ جديد

  const fileInputRef = useRef(null);

  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  const accountSchema = z.object({
    name_ar: z.string().min(2, t("account.form.nameAr.validation.min")),
    name_en: z.string().min(2, t("account.form.nameEn.validation.min")),
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
    category_id: z.string().optional(),
    job_title_ar: z.string().optional(),
    job_title_en: z.string().optional(),
    bio_ar: z.string().optional(),
    bio_en: z.string().optional(),
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
      name_ar: user?.name_ar || "",
      name_en: user?.name_en || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || null,
      category_id: user?.category?.id ? String(user.category.id) : "",
      job_title_ar: user?.job_title_ar || "",
      job_title_en: user?.job_title_en || "",
      bio_ar: user?.bio_ar || "",
      bio_en: user?.bio_en || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        name_ar: user?.name_ar || "",
        name_en: user?.name_en || "",
        email: user?.email || "",
        phone: user?.phone || "",
        image: user?.image || null,
        category_id: user?.category?.id ? String(user.category.id) : "",
        job_title_ar: user?.job_title_ar || "",
        job_title_en: user?.job_title_en || "",
        bio_ar: user?.bio_ar || "",
        bio_en: user?.bio_en || "",
      });
      setAvatar(user?.image || null);
      setSavedData(user);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data, variables) => {
      setSavedData(data); // ✅ حدّث آخر بيانات محفوظة
      dispatch(
        setCredentials({
          user: data,
        }),
      );
      setErrorMsg("");
      setIsEditing(false);

      const sentCategoryId = variables.get("category_id") || "";

      reset({
        name_ar: data?.name_ar || "",
        name_en: data?.name_en || "",
        email: data?.email || "",
        phone: data?.phone || "",
        image: data?.image || null,
        category_id: data?.category?.id
          ? String(data.category.id)
          : data?.category_id
            ? String(data.category_id)
            : sentCategoryId,
        job_title_ar: data?.job_title_ar || "",
        job_title_en: data?.job_title_en || "",
        bio_ar: data?.bio_ar || "",
        bio_en: data?.bio_en || "",
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
    formData.append("name[ar]", values.name_ar);
    formData.append("name[en]", values.name_en);
    formData.append("email", values.email);
    formData.append("phone", values.phone || "");
    formData.append("category_id", values.category_id || "");
    formData.append("job_title[ar]", values.job_title_ar);
    formData.append("job_title[en]", values.job_title_en);
    formData.append("bio[ar]", values.bio_ar);
    formData.append("bio[en]", values.bio_en);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    updateProfileMutation.mutate(formData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name_ar: savedData?.name_ar || "",
      name_en: savedData?.name_en || "",
      email: savedData?.email || "",
      phone: savedData?.phone || "",
      image: savedData?.image || null,
      // ✅ نفس منطق الـ onSuccess
      category_id: savedData?.category?.id
        ? String(savedData.category.id)
        : savedData?.category_id
          ? String(savedData.category_id)
          : "",
      job_title_ar: savedData?.job_title_ar || "",
      job_title_en: savedData?.job_title_en || "",
      bio_ar: savedData?.bio_ar || "",
      bio_en: savedData?.bio_en || "",
    });
    setAvatar(savedData?.image || null);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.nameAr.label")}
                placeholder={t("account.form.nameAr.placeholder")}
                error={errors.name_ar?.message}
                disabled={!isEditing}
              />
            )}
          />

          <Controller
            name="name_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.nameEn.label")}
                placeholder={t("account.form.nameEn.placeholder")}
                error={errors.name_en?.message}
                disabled={!isEditing}
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
                label={t("account.form.email.label")}
                placeholder={t("account.form.email.placeholder")}
                error={errors.email?.message}
                disabled={!isEditing}
              />
            )}
          />

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

          <div className="md:col-span-2">
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <MainInput
                  {...field}
                  type="select"
                  label={t("account.form.department.label")}
                  placeholder={t("account.form.department.placeholder")}
                  options={
                    categories &&
                    categories.map((option) => ({
                      value: String(option.id),
                      label: option.name,
                    }))
                  }
                  error={errors.category_id?.message}
                  disabled={!isEditing || categoriesLoading}
                />
              )}
            />
          </div>

          <Controller
            name="job_title_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.jobTitleAr.label")}
                placeholder={t("account.form.jobTitleAr.placeholder")}
                error={errors.job_title_ar?.message}
                disabled={!isEditing}
              />
            )}
          />

          <Controller
            name="job_title_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("account.form.jobTitleEn.label")}
                placeholder={t("account.form.jobTitleEn.placeholder")}
                error={errors.job_title_en?.message}
                disabled={!isEditing}
              />
            )}
          />

          <Controller
            name="bio_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="textarea"
                label={t("account.form.bioAr.label")}
                placeholder={t("account.form.bioAr.placeholder")}
                error={errors.bio_ar?.message}
                disabled={!isEditing}
              />
            )}
          />

          <Controller
            name="bio_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="textarea"
                label={t("account.form.bioEn.label")}
                placeholder={t("account.form.bioEn.placeholder")}
                error={errors.bio_en?.message}
                disabled={!isEditing}
              />
            )}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 max-w-md mx-auto">
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

        {isEditing && errorMsg && <FormError errorMsg={errorMsg} />}
      </form>
    </div>
  );
};

export default TeacherAccount;
