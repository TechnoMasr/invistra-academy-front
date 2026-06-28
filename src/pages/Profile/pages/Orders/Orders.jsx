import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"; // أو react-router-dom حسب مشروعك
import OrderCard from "@/components/cards/OrderCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import OrdersSkeleton from "@/components/Loading/SkeletonLoading/OrdersSkeleton";
import { getMyOrders } from "@/api/ordersServices";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Hook للـ Debounce الخاص بالبحث
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Orders = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL لتظل ثابتة عند عمل Refresh
  const currentSearch = searchParams.get("search") || "";
  const currentOrderStatus = searchParams.get("order_status") || "all";
  const currentPaymentStatus = searchParams.get("payment_status") || "all";
  const currentFromDate = searchParams.get("from_date") || "";
  const currentToDate = searchParams.get("to_date") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // إدارة حالة حقل إدخال البحث محلياً للـ Debounce
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  // دالة تحديث الفلاتر الشاملة في الـ URL
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // إذا تغير أي فلتر غير الصفحة، نعود للصفحة الأولى تلقائياً
    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  // مزامنة حقل البحث عند انتهاء الـ Debounce
  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  // مزامنة حالة حقل الإدخال إذا تغير الـ URL من الخارج
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب البيانات بناءً على الفلاتر النشطة من الـ URL
  const { data: orders, isLoading } = useQuery({
    queryKey: [
      "orders",
      currentSearch,
      currentOrderStatus,
      currentPaymentStatus,
      currentFromDate,
      currentToDate,
      currentPage,
    ],
    queryFn: () =>
      getMyOrders({
        search: currentSearch || undefined,
        order_status:
          currentOrderStatus !== "all" ? currentOrderStatus : undefined,
        payment_status:
          currentPaymentStatus !== "all" ? currentPaymentStatus : undefined,
        from_date: currentFromDate || undefined,
        to_date: currentToDate || undefined,
        page: currentPage,
      }),
  });

  const isEmpty = !isLoading && (orders?.items?.length === 0 || !orders);
  const totalPages = orders?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("orders.title")} />

      {/* قسم الفلاتر بنفس تصميم شبكة الكورسات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
        {/* بحث بكود الطلب */}
        <div>
          <label className="text-sm font-medium inline-block mb-2">
            {t("orders.searchLabel")}
          </label>
          <Input
            type="text"
            placeholder={t("orders.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* فلتر حالة الطلب */}
        <div>
          <label className="text-sm font-medium inline-block mb-2">
            {t("orders.orderStatusLabel")}
          </label>
          <Select
            value={currentOrderStatus}
            onValueChange={(val) => updateFilters("order_status", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("orders.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">{t("orders.all")}</SelectItem>
                <SelectItem value="ongoing">
                  {t("orders.status.ongoing")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("orders.status.completed")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t("orders.status.cancelled")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* فلتر حالة الدفع */}
        <div>
          <label className="text-sm font-medium inline-block mb-2">
            {t("orders.paymentStatusLabel")}
          </label>
          <Select
            value={currentPaymentStatus}
            onValueChange={(val) => updateFilters("payment_status", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("orders.paymentPlaceholder")} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">{t("orders.all")}</SelectItem>
                <SelectItem value="paid">{t("orders.payment.paid")}</SelectItem>
                <SelectItem value="unpaid">
                  {t("orders.payment.unpaid")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* فلاتر التاريخ (من - إلى) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium inline-block mb-2">
              {t("orders.fromDate")}
            </label>
            <Input
              type="date"
              value={currentFromDate}
              onChange={(e) => updateFilters("from_date", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium inline-block mb-2">
              {t("orders.toDate")}
            </label>
            <Input
              type="date"
              value={currentToDate}
              onChange={(e) => updateFilters("to_date", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* عرض البيانات أو الهياكل العظمية */}
      {isLoading ? (
        <OrdersSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("orders.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders?.items?.map((item) => (
              <OrderCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <MainPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(newPage) => updateFilters("page", newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
