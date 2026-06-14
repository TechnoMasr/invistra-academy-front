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

  // البيانات الافتراضية بناءً على الصورة المرفقة
  const user = {
    nameAr: "وليد مصطفى",
    nameEn: "Walid Mostafa",
    email: "walidmoustafa@gmail.com",
    phone: "+2010123456789",
    image:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    department: "english",
    jobTitleAr: "خبير اللغة الانجليزية",
    jobTitleEn: "English language expert",
    bioAr:
      "مستر وليد مصطفى هو محاضر متخصص في اللغة الإنجليزية يمتلك خبرة واسعة في تدريس مهارات اللغة بمختلف مستوياتها، بدءًا من الأساسيات وحتى المستويات المتقدمة...",
    bioEn:
      "Mr. Walid Mostafa is an English language instructor with extensive experience teaching language skills at all levels, from beginner to advanced...",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [avatar, setAvatar] = useState(user?.image || null);

  const fileInputRef = useRef(null);

  // تحديث الـ Schema لتشمل الحقول الثنائية
  const accountSchema = z.object({
    nameAr: z.string().min(2, t("account.form.nameAr.validation.min")),
    nameEn: z.string().min(2, t("account.form.nameEn.validation.min")),
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
    department: z.string().optional(),
    jobTitleAr: z.string().optional(),
    jobTitleEn: z.string().optional(),
    bioAr: z.string().optional(),
    bioEn: z.string().optional(),
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
      nameAr: user?.nameAr || "",
      nameEn: user?.nameEn || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || null,
      department: user?.department || "",
      jobTitleAr: user?.jobTitleAr || "",
      jobTitleEn: user?.jobTitleEn || "",
      bioAr: user?.bioAr || "",
      bioEn: user?.bioEn || "",
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
        nameAr: data?.nameAr,
        nameEn: data?.nameEn,
        email: data?.email,
        phone: data?.phone,
        image: data?.image,
        department: data?.department,
        jobTitleAr: data?.jobTitleAr,
        jobTitleEn: data?.jobTitleEn,
        bioAr: data?.bioAr,
        bioEn: data?.bioEn,
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
    formData.append("nameAr", values.nameAr);
    formData.append("nameEn", values.nameEn);
    formData.append("email", values.email);
    formData.append("phone", values.phone || "");
    formData.append("department", values.department || "");
    formData.append("jobTitleAr", values.jobTitleAr || "");
    formData.append("jobTitleEn", values.jobTitleEn || "");
    formData.append("bioAr", values.bioAr || "");
    formData.append("bioEn", values.bioEn || "");

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

  const departmentOptions = [
    { value: "english", label: "قسم اللغة الإنجليزية" },
    { value: "arabic", label: "قسم اللغة العربية" },
    { value: "math", label: "قسم الرياضيات" },
  ];

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

            <UserAvatar name={user?.nameAr} image={avatar} size={150} />

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

        {/* الاسم باللغة العربية */}
        <Controller
          name="nameAr"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label={t("account.form.nameAr.label")}
              placeholder={t("account.form.nameAr.placeholder")}
              error={errors.nameAr?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* الاسم باللغة الإنجليزية */}
        <Controller
          name="nameEn"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label={t("account.form.nameEn.label")}
              placeholder={t("account.form.nameEn.placeholder")}
              error={errors.nameEn?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* البريد الإلكتروني */}
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

        {/* رقم الهاتف */}
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

        {/* القسم */}
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="select"
              label={t("account.form.department.label")}
              placeholder={t("account.form.department.placeholder")}
              options={departmentOptions}
              error={errors.department?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* المسمى الوظيفي باللغة العربية */}
        <Controller
          name="jobTitleAr"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label={t("account.form.jobTitleAr.label")}
              placeholder={t("account.form.jobTitleAr.placeholder")}
              error={errors.jobTitleAr?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* المسمى الوظيفي باللغة الإنجليزية */}
        <Controller
          name="jobTitleEn"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              label={t("account.form.jobTitleEn.label")}
              placeholder={t("account.form.jobTitleEn.placeholder")}
              error={errors.jobTitleEn?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* نبذة عني باللغة العربية */}
        <Controller
          name="bioAr"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="textarea"
              label={t("account.form.bioAr.label")}
              placeholder={t("account.form.bioAr.placeholder")}
              error={errors.bioAr?.message}
              disabled={!isEditing}
            />
          )}
        />

        {/* نبذة عني باللغة الإنجليزية */}
        <Controller
          name="bioEn"
          control={control}
          render={({ field }) => (
            <MainInput
              {...field}
              type="textarea"
              label={t("account.form.bioEn.label")}
              placeholder={t("account.form.bioEn.placeholder")}
              error={errors.bioEn?.message}
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
