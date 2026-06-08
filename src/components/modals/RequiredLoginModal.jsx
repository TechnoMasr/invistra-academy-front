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

const RequiredLoginModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal());
  };

  const handleCreateAccount = () => {
    navigate("/register");
    onClose();
  };

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  return (
    <Dialog open={modalName === "requiredLoginModal"} onOpenChange={onClose}>
      <DialogContent>
        <div className="modal_icon">
          <PiShieldWarning />
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">
            {t("requiredLoginModal.title")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("requiredLoginModal.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCreateAccount}
          >
            {t("requiredLoginModal.createAccount")}
          </Button>

          <Button className="flex-1" onClick={handleLogin}>
            {t("requiredLoginModal.login")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequiredLoginModal;
