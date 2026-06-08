import { logoutAction } from "@/store/user/userActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModal } from "@/store/modals/modalsSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GiEntryDoor } from "react-icons/gi";

const LogOutModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modals);
  const { logOutLoading } = useSelector((state) => state.user);

  const onClose = () => {
    dispatch(closeModal());
  };

  const handleLogout = () => {
    dispatch(logoutAction())
      .unwrap()
      .then(() => onClose());
  };

  return (
    <Dialog open={modalName === "logOutModal"} onOpenChange={onClose}>
      <DialogContent>
        <div className="modal_icon danger">
          <GiEntryDoor />
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">
            {t("logOutModal.logoutConfirm")}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className={`flex-1`}
            variant="outline"
            disabled={logOutLoading}
            onClick={onClose}
          >
            {t("logOutModal.cancel")}
          </Button>

          <Button
            className={`flex-1`}
            variant="destructive"
            disabled={logOutLoading}
            onClick={handleLogout}
          >
            {logOutLoading && (
              <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
            )}
            {t("logOutModal.logout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutModal;
