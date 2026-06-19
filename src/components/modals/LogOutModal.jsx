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
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/authServices";
import { logout } from "@/store/auth/authSlice";

const LogOutModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal());
  };

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout());
      onClose();
    },
    onError: (err) => {
      console.log("Logout Error:", err);
      dispatch(logout());
      onClose();
    },
  });

  const handleLogout = () => {
    logoutMutate();
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
            disabled={isPending}
            onClick={onClose}
          >
            {t("logOutModal.cancel")}
          </Button>

          <Button
            className={`flex-1`}
            variant="destructive"
            disabled={isPending}
            onClick={handleLogout}
          >
            {isPending && (
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
