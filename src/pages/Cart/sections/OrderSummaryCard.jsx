import { Button } from "@/components/ui/button";
import { openModal } from "@/store/modals/modalsSlice";
import { GrCart } from "react-icons/gr";
import { PiMoneyWavyBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

const OrderSummaryCard = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <div className="w-full lg:w-96 p-4 space-y-3 border rounded-lg h-max bg-primary/10 shadow-lg sticky top-30">
      <h2 className="text-xl font-bold pb-3 border-b-2">ملخص الطلب</h2>

      <div className="flex justify-between items-center gap-2">
        <p className="text-xl font-medium">العدد:</p>
        <p className="text-xl font-semibold">{data?.count}</p>
      </div>

      <div className="flex justify-between items-center gap-2">
        <p className="text-xl font-medium">الاجمالي:</p>
        <p className="text-3xl font-bold text-green-600">
          {data?.total} {data?.currency}
        </p>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={() => dispatch(openModal({ modalName: "PaymentModal" }))}
        >
          الدفع <PiMoneyWavyBold />
        </Button>

        <Link to="/courses" className="w-full rounded-full">
          <Button variant="outline" className="w-full">
            استكمال الشراء <GrCart />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
