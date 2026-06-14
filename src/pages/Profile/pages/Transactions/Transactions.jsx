import React from "react";
import ProfileTitle from "@/components/common/ProfileTitle";
import { FaWallet, FaRegCircleCheck } from "react-icons/fa6"; // أيقونات مناسبة للكروت
import { PiHandDepositBold } from "react-icons/pi"; // أيقونة للرصيد المحول

const Transactions = () => {
  // بيانات تجريبية تحاكي الموجودة في الصورة تماماً لقائمة التحويلات
  const transactionsData = [
    {
      id: 1,
      amount: "3,500",
      method: "فودافون كاش",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 2,
      amount: "2,500",
      method: "انستا باي",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 3,
      amount: "8,500",
      method: "فودافون كاش",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 4,
      amount: "10,000",
      method: "فودافون كاش",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 5,
      amount: "5,500",
      method: "انستا باي",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 6,
      amount: "6,000",
      method: "انستا باي",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
    {
      id: 7,
      amount: "6,000",
      method: "انستا باي",
      account: "******123456",
      date: "10 مايو 2026 . 10:30 ص",
    },
  ];

  return (
    <div className="space-y-6">
      <ProfileTitle title="التحويلات المالية" />

      {/* قسم الكروت الإحصائية العلوية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* كارت الرصيد المحول - أحمر */}
        <div className="bg-[#FFF1F2] border border-[#FB5151] rounded-2xl p-5 flex items-center gap-2 shadow-sm">
          <div className="bg-[#FB5151] text-white p-3 rounded-full text-2xl">
            <PiHandDepositBold />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500 block">
              الرصيد المحول
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              3,500 <span className="text-lg font-normal">ج.م.</span>
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
              الرصيد الحالي
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              6,500 <span className="text-lg font-normal">ج.م.</span>
            </span>
          </div>
        </div>

        {/* كارت إجمالي الرصيد - أخضر */}
        <div className="bg-[#F0FDF4] border border-[#34C759] rounded-2xl p-5 flex items-center gap-2 shadow-sm">
          <div className="bg-[#34C759] text-white p-3 rounded-full text-xl">
            <FaRegCircleCheck />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500 block">
              اجمالي الرصيد
            </span>
            <span className="text-2xl font-bold text-[#1E293B]">
              10,000 <span className="text-lg font-normal">ج.م.</span>
            </span>
          </div>
        </div>
      </div>

      {/* عنوان قسم قائمة التحويلات */}
      <div className="pt-4">
        <h3 className="text-2xl font-bold text-[#1E2229]">التحويلات</h3>
      </div>

      {/* قائمة التحويلات */}
      <div className="flex flex-col gap-4">
        {transactionsData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 rounded-2xl p-4 md:p-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-sm hover:border-gray-400 transition-all"
          >
            {/* قيمة التحويل */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">
                قيمة التحويل
              </span>
              <span className="text-base font-bold text-[#22C55E]">
                {item.amount} ج.م.
              </span>
            </div>

            {/* الحساب / الرقم الشخصي */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">
                رقم الحساب
              </span>
              <span className="text-sm font-medium text-gray-700">
                {item.account}
              </span>
            </div>

            {/* طريقة التحويل */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">
                طريقة التحويل
              </span>
              <span className="text-sm font-medium text-gray-700">
                {item.method}
              </span>
            </div>

            {/* التاريخ والوقت */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">
                التاريخ والوقت
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
