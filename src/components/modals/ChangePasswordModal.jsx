import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/authServices";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";

const ChangePasswordModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- schema ---------------- */
  const changePasswordSchema = z
    .object({
      old_password: z
        .string()
        .min(6, t("changePassword.form.currentPassword.validation.min")),
      password: z
        .string()
        .min(6, t("changePassword.form.newPassword.validation.min")),
      password_confirmation: z
        .string()
        .min(6, t("changePassword.form.confirmPassword.validation.min")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("changePassword.form.confirmPassword.validation.match"),
      path: ["password_confirmation"],
    });

  /* ---------------- form ---------------- */
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  /* ---------------- mutation ---------------- */
  const changePasswordMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success(t("changePassword.messages.success"));
      reset();
      onClose();
      setErrorMsg("");
    },
    onError: (error) => {
      setErrorMsg(error?.response?.data?.message);
    },
  });

  /* ---------------- submit ---------------- */
  const onSubmit = (data) => {
    changePasswordMutation.mutate({
      old_password: data.old_password,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <Dialog open={modalName === "changePasswordModal"} onOpenChange={onClose}>
      <DialogContent
        style={{
          pointerEvents: changePasswordMutation.isPending ? "none" : "auto",
        }}
      >
        <DialogHeader className="text-center">
          <DialogDescription />
          <DialogTitle className="text-xl text-center">
            {t("changePassword.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <Controller
            name="old_password"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("changePassword.form.currentPassword.label")}
                type="password"
                error={errors.old_password?.message}
              />
            )}
          />

          {/* New Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("changePassword.form.newPassword.label")}
                type="password"
                error={errors.password?.message}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("changePassword.form.confirmPassword.label")}
                type="password"
                error={errors.password_confirmation?.message}
              />
            )}
          />

          <DialogFooter className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              {t("changePassword.buttons.cancel")}
            </Button>

            <Button
              type="submit"
              className="flex-1"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? t("changePassword.buttons.submitting")
                : t("changePassword.buttons.submit")}
            </Button>
          </DialogFooter>

          {errorMsg && <FormError errorMsg={errorMsg} />}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
