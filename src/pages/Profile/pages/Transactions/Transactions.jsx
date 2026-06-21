import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import { FaWallet, FaRegCircleCheck } from "react-icons/fa6";
import { PiHandDepositBold } from "react-icons/pi";
import { getInstructorWallet } from "@/api/ExamServices";
import { useQuery } from "@tanstack/react-query";
import MainPagination from "@/components/common/MainPagination";
import TransactionsSkeleton from "@/components/Loading/SkeletonLoading/TransactionsSkeleton";
import EmptyDataSection from "@/components/sections/EmptyDataSection";

const Transactions = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  // تمرير رقم الصفحة الحالية إلى الـ API وتحديث الـ queryKey عند تغييرها
  const {
    data: wallet,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wallet", page],
    queryFn: () => getInstructorWallet(page),
    keepPreviousData: true, // للحفاظ على سلاسة التنقل بين الصفحات
  });

  // const walletData = {
  //   extra: {
  //     transferred: 5,
  //     earned: 5,
  //     due: 0,
  //     currency: "USD",
  //   },
  //   items: [
  //     {
  //       id: 2,
  //       amount: "5.00",
  //       payment_method: "Vodafone Cash",
  //       account_number: "45324234",
  //       currency: "EGP",
  //       created_at: "2026-06-17T09:31:00.000000Z",
  //     },
  //   ],
  //   meta: {
  //     current_page: 1,
  //     last_page: 1,
  //     per_page: 10,
  //     total: 1,
  //     next_page_url: null,
  //     prev_page_url: null,
  //   },
  // };

  // استخراج البيانات الأساسية من رد السيرفر مع وضع قيم افتراضية
  const extra = wallet?.extra || { transferred: 0, earned: 0, due: 0 };
  const transactions = wallet?.items || [];
  const meta = wallet?.meta || { current_page: 1, last_page: 1 };

  // دالة لتنسيق التاريخ القادم من السيرفر بشكل مقروء
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // معالجة حالة التحميل
  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  // معالجة حالة حدوث خطأ
  if (isError) {
    return (
      <div className="text-center text-red-500 font-semibold py-8">
        {t("transactions.loadError")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("transactions.title")} />

      {/* قسم الكروت الإحصائية العلوية مأخوذة من كائن extra */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* كارت الرصيد المحول - أحمر */}
        <div className="bg-[#FFF1F2] border border-[#FB5151] rounded-2xl p-5 flex items-center gap-2 shadow-sm">
          <div className="bg-[#FB5151] text-white p-3 rounded-full text-2xl">
            <PiHandDepositBold />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500 block">
              {t("transactions.transferredBalance")}
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              {extra.transferred}{" "}
              <span className="text-lg font-normal">{extra.currency}</span>
            </span>
          </div>
        </div>

        {/* كارت الرصيد الحالي - أزرق */}
        <div className="bg-[#EFF6FF] border border-[#0088FF] rounded-2xl p-5 flex items-center gap-2 shadow-sm">
          <div className="bg-[#0088FF] text-white p-3 rounded-full text-xl">
            <FaWallet />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500 block">
              {t("transactions.currentBalance")}
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              {extra.due}{" "}
              <span className="text-lg font-normal">{extra.currency}</span>
            </span>
          </div>
        </div>

        {/* كارت إجمالي الأرباح - أخضر */}
        <div className="bg-[#F0FDF4] border border-[#34C759] rounded-2xl p-5 flex items-center gap-2 shadow-sm">
          <div className="bg-[#34C759] text-white p-3 rounded-full text-xl">
            <FaRegCircleCheck />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500 block">
              {t("transactions.totalEarnings")}
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              {extra.earned}{" "}
              <span className="text-lg font-normal">{extra.currency}</span>
            </span>
          </div>
        </div>
      </div>

      {/* عنوان قسم قائمة التحويلات */}
      <div className="pt-4">
        <h3 className="text-2xl font-bold text-[#1E2229]">{t("transactions.transfers")}</h3>
      </div>

      {/* قائمة التحويلات الديناميكية */}
      <div className="flex flex-col gap-4">
        {transactions.length === 0 ? (
          <EmptyDataSection msg={t("transactions.noTransfers")} />
        ) : (
          transactions.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 rounded-2xl p-4 md:p-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-sm hover:border-gray-400 transition-all"
            >
              {/* قيمة التحويل */}
              <div className="flex flex-col gap-1">
                <span className="font-bold">{t("transactions.transferValue")}</span>
                <span className="text-base font-bold text-[#22C55E]">
                  {parseFloat(item.amount).toLocaleString()} {item.currency}
                </span>
              </div>

              {/* رقم الحساب */}
              <div className="flex flex-col gap-1">
                <span className="font-bold">{t("transactions.accountNumber")}</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.account_number || t("transactions.notSpecified")}
                </span>
              </div>

              {/* طريقة التحويل */}
              <div className="flex flex-col gap-1">
                <span className="font-bold">{t("transactions.transferMethod")}</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.payment_method === "Vodafone Cash"
                    ? t("transactions.vodafoneCash")
                    : item.payment_method}
                </span>
              </div>

              {/* التاريخ والوقت */}
              <div className="flex flex-col gap-1">
                <span className="font-bold">{t("transactions.dateTime")}</span>
                <span className="text-xs text-gray-600 font-medium">
                  {formatDate(item.created_at)}
                </span>
              </div>
            </div>
          ))
        )}

        {/* الـ Pagination يظهر فقط إذا كان هناك صفحات متعددة */}
        {meta.last_page > 1 && (
          <div className="flex justify-center pt-4">
            <MainPagination
              totalPages={meta.last_page}
              currentPage={meta.current_page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
