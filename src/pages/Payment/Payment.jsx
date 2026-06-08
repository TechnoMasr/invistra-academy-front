import { useParams, useNavigate } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isSuccess = status === "success";
  const isFailed = status === "failed";

  return (
    <section className="container min-h-screen pt-20 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
        {/* Icon */}
        {isSuccess && (
          <FaCheckCircle className="mx-auto text-primary text-[90px]" />
        )}

        {isFailed && (
          <FaTimesCircle className="mx-auto text-destructive text-[90px]" />
        )}

        {!isSuccess && !isFailed && (
          <FaExclamationCircle className="mx-auto text-muted-foreground text-[90px]" />
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold">
          {isSuccess && t("payment.success.title")}
          {isFailed && t("payment.failed.title")}
          {!isSuccess && !isFailed && t("payment.unknown.title")}
        </h1>

        {/* Description */}
        <p className="text-gray-600">
          {isSuccess && t("payment.success.description")}
          {isFailed && t("payment.failed.description")}
          {!isSuccess && !isFailed && t("payment.unknown.description")}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          {isFailed && (
            <a href="/cart">
              <Button variant="destructive">
                {t("payment.actions.retry")}
              </Button>
            </a>
          )}

          <a href="/profile/orders">
            <Button variant="outline">{t("payment.actions.orders")}</Button>
          </a>

          <a href="/">
            <Button>{t("payment.actions.home")}</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Payment;
