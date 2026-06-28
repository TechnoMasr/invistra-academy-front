import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"; // أو react-router-dom حسب مشروعك
import { useTranslation } from "react-i18next";
import OrdersDetailsCard from "@/components/cards/OrdersDetailsCard";
import ProfileTitle from "@/components/common/ProfileTitle";
import MyCoursesSkeleton from "@/components/Loading/SkeletonLoading/MyCoursesSkeleton";
import { getMyCoursesStudent } from "@/api/myCoursesServices";
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

// Custom Hook للـ Debounce الخاص بالبحث باسم الكورس
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const StudentCourses = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL للحفاظ عليها عند تحديث الصفحة
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  // إدارة حالة حقل البحث محلياً
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

    // تصفير الصفحة إلى 1 عند تغيير أي فلتر آخر
    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  // مزامنة قيمة البحث الفعلي بعد انتهاء الـ Debounce
  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  // تحديث حقل الإدخال إذا تغير الـ URL من الخارج
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب البيانات بناءً على الفلاتر من الـ URL
  const { data: myCourses, isLoading } = useQuery({
    queryKey: ["myCourses", currentSearch, currentStatus, currentPage],
    queryFn: () =>
      getMyCoursesStudent({
        search: currentSearch || undefined,
        status: currentStatus !== "all" ? currentStatus : undefined,
        page: currentPage,
      }),
  });

  const isEmpty =
    !isLoading && (!myCourses?.items || myCourses?.items?.length === 0);

  const totalPages = myCourses?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("myCourses.title")} />

      {/* قسم الفلاتر والبحث متناسق مع باقي الصفحات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-card rounded-lg border">
        {/* حقل البحث باسم الكورس */}
        <div>
          <label className="text-sm font-medium inline-block mb-2">
            {t("myCourses.searchLabel")}
          </label>
          <Input
            type="text"
            placeholder={t("myCourses.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* فلتر حالة الكورس */}
        <div>
          <label className="text-sm font-medium inline-block mb-2">
            {t("myCourses.statusLabel")}
          </label>
          <Select
            value={currentStatus}
            onValueChange={(val) => updateFilters("status", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("myCourses.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">{t("myCourses.all")}</SelectItem>
                <SelectItem value="pending">
                  {t("myCourses.status.pending")}
                </SelectItem>
                <SelectItem value="done">
                  {t("myCourses.status.done")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* عرض البيانات أو حالات التحميل والبيانات الفارغة */}
      {isLoading ? (
        <MyCoursesSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("myCourses.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses?.items?.map((item) => (
              <OrdersDetailsCard key={item.id} item={item} />
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

export default StudentCourses;
