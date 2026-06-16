import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router"; // أو react-router-dom حسب النسخة المستخدمة لديك
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { Button } from "@/components/ui/button";
import { FiCheckCircle } from "react-icons/fi";

const SuccessesPaymentModal = () => {
  const { modalName } = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={modalName === "SuccessesPaymentModal"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 text-center dir-rtl">
        <DialogHeader className="flex flex-col items-center justify-center space-y-3">
          {/* أيقونة النجاح */}
          <FiCheckCircle className="animate-pulse text-green-600" size={100} />

          <DialogTitle className="text-xl font-bold text-gray-900">
            تم تسجيل طلبك بنجاح!
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-700 text-center max-w-xs">
            شكراً لك! تم استلام بيانات الدفع والطلب بنجاح، وجاري مراجعة التحويل
            وتأكيد الطلب من قبل الإدارة في أقرب وقت.
          </DialogDescription>
        </DialogHeader>

        {/* أزرار التحكم */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5 w-full"></div>

        <DialogFooter>
          <Link
            to="/profile/orders"
            onClick={onClose} // غلق المودال عند الانتقال للرابط
          >
            <Button className="w-full font-medium">الذهاب إلى طلباتي</Button>
          </Link>

          <Button variant="outline" onClick={onClose}>
            حسناً
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessesPaymentModal;
