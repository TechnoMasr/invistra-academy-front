import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createOrder, getCartSummary } from "@/api/cartServices";

import { GrCart } from "react-icons/gr";
import { PiMoneyWavyBold, PiSpinnerGapBold } from "react-icons/pi";
import {
  FiUploadCloud,
  FiX,
  FiCopy,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

import instaPay from "@/assets/icons/insta-pay.jpg";
import vodafoneCash from "@/assets/icons/vodafone-cash.webp";
import online from "@/assets/icons/online.jpg";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";

const STATIC_PAYMENT_METHODS = [
  {
    id: 1,
    title: "orderSummary.vodafoneCash",
    image: vodafoneCash,
    key: "vodafone_cash",
  },
  { id: 2, title: "orderSummary.instaPay", image: instaPay, key: "instapay" },
  { id: 3, title: "orderSummary.onlinePayment", image: online, key: "online" },
];

const OrderSummaryCard = ({ summary, payment_methods = [] }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState(""); // حالة جديدة للخطأ
  const [copied, setCopied] = useState(false);

  const filteredPaymentList = STATIC_PAYMENT_METHODS.filter((staticMethod) =>
    payment_methods.some((apiMethod) => apiMethod.key === staticMethod.key),
  );

  const currentMethodDetails = payment_methods.find(
    (m) => m.key === selectedMethod,
  );

  // إدارة رابط معاينة الصورة لتجنب تسريب الذاكرة
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["cartSummary", selectedMethod],
    queryFn: () => getCartSummary(selectedMethod),
    enabled: !!selectedMethod,
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // إذا كان دفع أونلاين خارجي، يتم تحويله مباشرة
      if (selectedMethod === "online" && data?.payment_link) {
        window.location.href = data.payment_link;
        return;
      }

      // إظهار التوست وتحديث الكاش
      dispatch(openModal({ modalName: "SuccessesPaymentModal" }));
      // toast.success("تم إنشاء الطلب بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartItemsCount"] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error(t("orderSummary.orderError"));
      console.error(error);
    },
  });

  const handleCopyNumber = (number) => {
    if (!number) return;
    navigator.clipboard
      .writeText(number)
      .then(() => {
        setCopied(true);
        toast.success(t("orderSummary.copySuccess"));
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error(t("orderSummary.copyFailed"), err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageError("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleFinalPayment = () => {
    // التعديل هنا: إذا لم يتم اختيار طريقة دفع، يظهر الخطأ ولا يكمل الدالة
    if (!selectedMethod) {
      setPaymentMethodError(t("orderSummary.selectPaymentError"));
      // toast.warning("برجاء اختيار طريقة الدفع أولاً");
      return;
    }

    if (selectedMethod !== "online" && !imageFile) {
      setImageError(t("orderSummary.uploadImageError"));
      return;
    }

    const formData = new FormData();
    formData.append("payment_method", selectedMethod);
    if (imageFile && selectedMethod !== "online") {
      formData.append("transfer_image", imageFile);
    }

    orderMutation.mutate(formData);
  };

  const isComponentLoading = isSummaryLoading || orderMutation.isPending;

  return (
    <div className="w-full lg:w-80 xl:w-96 p-3 space-y-4 border rounded-2xl h-max bg-primary/10 shadow-xl sticky top-24 transition-all duration-300">
      {/* Loading Overlay */}
      {isComponentLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-2xl gap-3 animate-fade-in">
          <PiSpinnerGapBold className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-gray-700 selection:bg-transparent">
            {orderMutation.isPending
              ? t("orderSummary.processing")
              : t("orderSummary.updating")}
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold pb-2 border-b">
        {t("orderSummary.title")}
      </h2>

      {/* Summary Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-700">
          <span className="text-sm font-medium">{t("orderSummary.count")}</span>
          <span className="text-lg font-bold">{summary?.count}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {t("orderSummary.mainTotal")}
          </span>
          <span className="text-2xl font-bold text-green-600 tracking-tight">
            {summary?.total} {summary?.currency}
          </span>
        </div>
      </div>

      {/* Payment Methods Selection */}
      {filteredPaymentList.length > 0 && (
        <div className="pt-2">
          <h3 className="font-bold mb-2.5">
            {t("orderSummary.choosePayment")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {filteredPaymentList.map((item) => {
              const isSelected = selectedMethod === item.key;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedMethod(item.key);
                    setImageFile(null);
                    setImageError("");
                    setPaymentMethodError(""); // مسح رسالة الخطأ عند الاختيار
                  }}
                  className={`group relative flex flex-col items-center p-2 border rounded-xl cursor-pointer transition-all duration-300 select-none text-center ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "hover:border-primary/40 hover:bg-primary/10 hover:scale-[1.02]"
                  }`}
                >
                  <div className="w-full aspect-video overflow-hidden rounded-lg border border-gray-100 mb-1.5 bg-gray-50">
                    {item.image && (
                      <img
                        loading="lazy"
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {t(item.title)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Payment Details */}
      {selectedMethod && (
        <div className="p-3.5 bg-white rounded-xl border border-dashed border-gray-500 space-y-3.5 shadow-inner text-sm">
          {summaryData && (
            <div className="space-y-2 pb-2.5 border-b border-gray-100">
              <div className="flex justify-between items-center text-gray-700">
                <span>{t("orderSummary.subtotal")}</span>
                <span className="font-semibold text-gray-700">
                  {summaryData.total} {summaryData.currency}
                </span>
              </div>

              {summaryData.service_fee > 0 && (
                <div className="flex justify-between items-center text-amber-600 font-medium">
                  <span>
                    {t("orderSummary.serviceFee", {
                      percent: currentMethodDetails?.service_fee,
                    })}
                  </span>
                  <span>
                    +{summaryData.service_fee} {summaryData.currency}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-dotted border-gray-200">
                <span className="text-sm font-bold">
                  {t("orderSummary.finalTotal")}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {summaryData.total_with_fee} {summaryData.currency}
                </span>
              </div>
            </div>
          )}

          {/* Transfer Number Box */}
          {currentMethodDetails?.transfer_number && (
            <div className="bg-gray-100 p-2.5 rounded-xl border border-gray-100 text-center space-y-1.5">
              <p className="text-sm text-gray-600 font-medium">
                {t("orderSummary.transferTo")}
              </p>
              <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg pl-1.5 pr-3 py-1 w-full shadow-sm">
                <span className="text-base font-extrabold text-primary tracking-widest font-mono select-all">
                  {currentMethodDetails.transfer_number}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyNumber(currentMethodDetails.transfer_number)
                  }
                  className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    copied
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50 active:scale-95"
                  }`}
                  title={t("orderSummary.copyNumber")}
                >
                  {copied ? (
                    <FiCheck className="w-3.5 h-3.5" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Image Uploader */}
          {selectedMethod !== "online" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-600">
                {t("orderSummary.attachReceipt")}
              </label>

              {!imageFile ? (
                <label
                  className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-all duration-200 group ${
                    imageError
                      ? "border-red-400 bg-red-50/30"
                      : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <FiUploadCloud
                      className={`w-7 h-7 mb-1.5 transition-colors duration-200 ${
                        imageError
                          ? "text-red-400 group-hover:text-red-500"
                          : "text-gray-400 group-hover:text-primary"
                      }`}
                    />
                    <p
                      className={`text-[11px] font-bold ${imageError ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"}`}
                    >
                      {t("orderSummary.clickToUpload")}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-full h-36 rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-gray-900 group">
                  <img
                    src={previewUrl}
                    alt="Receipt Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 inset-e-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                    title={t("orderSummary.deleteImage")}
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] p-1 truncate text-center font-mono">
                    {imageFile.name}
                  </div>
                </div>
              )}

              {imageError && (
                <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
                  <FiAlertTriangle className="w-3.5 h-3.5 shrink-0" />{" "}
                  {imageError}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        {/* إظهار رسالة الخطأ هنا أسفل الأزرار عند الضغط بدون اختيار طريقة */}
        {paymentMethodError && (
          <p className="flex items-center justify-center gap-1 text-[12px] font-bold text-red-600 mt-1 bg-red-50 p-2 rounded-lg border border-red-200 dynamic-error">
            <FiAlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />{" "}
            {paymentMethodError}
          </p>
        )}

        <Button
          className={`w-full`}
          onClick={handleFinalPayment}
          disabled={isComponentLoading}
        >
          {orderMutation.isPending
            ? t("orderSummary.processing")
            : t("orderSummary.confirmPayment")}
          <PiMoneyWavyBold className="mr-1.5 w-4 h-4" />
        </Button>

        <Link to="/courses" className="block w-full">
          <Button className={`w-full`} variant="outline">
            {t("orderSummary.continueShopping")}
            <GrCart className="mr-1.5 w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
