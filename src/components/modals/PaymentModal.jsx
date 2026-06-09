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

const PaymentModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  const list = [
    {
      id: 1,
      title: "فودافون كاش",
      description: "تحويل فوري عبر المحفظة",
      image: image,
    },
    {
      id: 2,
      title: "إنستا باي (Insta Pay)",
      description: "تحويل بنكي لحظي",
      image: image,
    },
    {
      id: 3,
      title: "دفع اونلاين",
      description: "بطاقات فيزا أو ماستركارد",
      image: image,
    },
  ];

  return (
    <Dialog open={modalName === "PaymentModal"} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle className="text-2xl">اختر طريقة الدفع</DialogTitle>
          <DialogDescription className="text-primary/90">
            يرجى اختيار الوسيلة الأنسب لك لإتمام العملية
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
