import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";

const TermsModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modalName } = useSelector((state) => state.modals);
  const { settings } = useSelector((state) => state.settings);

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={modalName === "termsModal"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("TermsModal.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("TermsModal.description")}
          </DialogDescription>
        </DialogHeader>

        <div
          className="-mx-4 custom_scrollbar max-h-[60vh] overflow-y-auto px-4 rich_content"
          dangerouslySetInnerHTML={{
            __html: settings?.terms_conditions,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
