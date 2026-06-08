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
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { isValidPhoneNumber } from "react-phone-number-input";
import { sendContactUs } from "@/api/mainServices";
import PhoneInputField from "../form/PhoneInputField";

const ContactUsModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  const { t } = useTranslation();

  const contactSchema = z.object({
    name: z.string().min(2, t("ContactForm.nameRequired")),
    email: z.string().email(t("ContactForm.invalidEmail")),
    message: z.string().min(10, t("ContactForm.messageMin")),
    phone: z.string().refine((value) => isValidPhoneNumber(value || ""), {
      message: t("ContactForm.invalidPhone"),
    }),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: sendContactUs,
    onSuccess: () => {
      reset();
      onClose();
      toast.success(t("ContactForm.successMessage"));
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Dialog open={modalName === "ContactUsModal"} onOpenChange={onClose}>
      <DialogContent
        style={{
          pointerEvents: isPending ? "none" : "auto",
        }}
      >
        <DialogHeader className="text-center">
          <DialogDescription />
          <DialogTitle className="text-xl text-center">
            {t("ContactForm.heading")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label={t("ContactForm.name")}
                placeholder={t("ContactForm.namePlaceholder")}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInputField
                {...field}
                label={t("ContactForm.phone")}
                placeholder={t("ContactForm.phonePlaceholder")}
                error={errors.phone?.message}
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
                label={t("ContactForm.email")}
                placeholder={t("ContactForm.emailPlaceholder")}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                type="textarea"
                label={t("ContactForm.message")}
                placeholder={t("ContactForm.messagePlaceholder")}
                error={errors.message?.message}
              />
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("ContactForm.sending") : t("ContactForm.send")}
          </Button>

          {error && (
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                t("ContactForm.somethingWrong")
              }
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsModal;
