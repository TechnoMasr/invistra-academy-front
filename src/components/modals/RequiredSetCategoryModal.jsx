import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { PiShieldWarning } from "react-icons/pi";

const RequiredSetCategoryModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal());
  };

  const handleCancel = () => {
    onClose();
  };

  const handleVerify = () => {
    navigate("/profile");
    onClose();
  };

  return (
    <Dialog
      open={modalName === "requiredSetCategoryModal"}
      onOpenChange={onClose}
    >
      <DialogContent>
        <div className="modal_icon">
          <PiShieldWarning />
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">
            {t("requiredSetCategoryModal.title")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("requiredSetCategoryModal.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            {t("requiredSetCategoryModal.cancel")}
          </Button>

          <Button className="flex-1" onClick={handleVerify}>
            {t("requiredSetCategoryModal.goToProfile")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequiredSetCategoryModal;
