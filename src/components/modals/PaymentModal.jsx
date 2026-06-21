import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import image from "@/assets/images/hero.png";

import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";

const PaymentModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClose = () => {
    dispatch(closeModal());
  };

  const list = [
    {
      id: 1,
      title: t("paymentModal.vodafoneCash"),
      description: t("paymentModal.vodafoneCashDesc"),
      image: image,
    },
    {
      id: 2,
      title: t("paymentModal.instaPay"),
      description: t("paymentModal.instaPayDesc"),
      image: image,
    },
    {
      id: 3,
      title: t("paymentModal.onlinePayment"),
      description: t("paymentModal.onlinePaymentDesc"),
      image: image,
    },
  ];

  return (
    <Dialog open={modalName === "PaymentModal"} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle className="text-2xl">{t("paymentModal.title")}</DialogTitle>
          <DialogDescription className="text-primary/90">
            {t("paymentModal.description")}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-3">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 border rounded-lg p-2 hover:bg-primary/10 transition duration-300 ease-in-out cursor-pointer"
            >
              <div className="w-12 aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm opacity-90">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
