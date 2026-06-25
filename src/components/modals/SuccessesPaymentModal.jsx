import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { Button } from "@/components/ui/button";
import { FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const SuccessesPaymentModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={modalName === "SuccessesPaymentModal"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 text-center">
        <DialogHeader className="flex flex-col items-center justify-center space-y-3">
          <FiCheckCircle className="animate-pulse text-green-600" size={100} />

          <DialogTitle className="text-xl font-bold text-gray-900">
            {t("successPaymentModal.title")}
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-700 text-center max-w-xs">
            {t("successPaymentModal.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Link to="/profile/orders" onClick={onClose}>
            <Button className="w-full font-medium">
              {t("successPaymentModal.goToOrders")}
            </Button>
          </Link>

          <Button variant="outline" onClick={onClose}>
            {t("successPaymentModal.ok")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessesPaymentModal;
