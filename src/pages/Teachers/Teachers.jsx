import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"; // للتأكد من مطابقة نفس إصدار راوتر صفحة الكورسات
import TeacherCard from "@/components/cards/TeacherCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHead from "@/components/common/PageHead";
import MainPagination from "@/components/common/MainPagination";
import { useQuery } from "@tanstack/react-query";
import { getInstructorsPage } from "@/api/instructorsServices";
import { Input } from "@/components/ui/input";
import SeoManager from "@/utils/SeoManager";
import { useSelector } from "react-redux";
import TeachersSkeleton from "@/components/Loading/SkeletonLoading/TeachersSkeleton";
import EmptyDataSection from "@/components/sections/EmptyDataSection";

// Custom Hook للـ Debounce لمنع إرسال طلبات مع كل حرف يكتبه المستخدم
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Teachers = () => {
  // استخدام useSearchParams للتحكم في الـ URL params
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL (البحث و قسم المحاضر)
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category_id") || "all";

  // State محلي لحقل إدخال البحث لضمان سلاسة الكتابة
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500); // إرسال الطلب بعد نصف ثانية من التوقف عن الكتابة

  // دالة لتحديث الـ URLParams مع الحفاظ على بقية الفلاتر
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key); // لو اختار "الكل" أو تم مسح النص يحذف تماماً من الرابط
    }

    setSearchParams(newParams);
  };

  // تحديث الـ URL تلقائياً بمجرد استقرار قيمة الـ Debounced Search
  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  // تحديث حقل الإدخال لو تم تغيير الـ URL من الخارج (أزرار التنقل أو تصفير الفلاتر)
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب المحاضرين بناءً على قيم الفلاتر الحالية من الـ URL
  const { data: instructors, isLoading } = useQuery({
    // ربط الـ queryKey بالفلاتر لضمان عمل الـ Refetch تلقائياً عند تغيرها
    queryKey: ["instructors-page", currentSearch, currentCategory],
    queryFn: () =>
      getInstructorsPage({
        search: currentSearch || undefined,
        category_id: currentCategory !== "all" ? currentCategory : undefined,
      }),
  });

  // جلب قائمة الأقسام لعرضها في قائمة الفلترة
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  return (
    <>
      <SeoManager
        title={instructors?.extra?.seo?.meta_title}
        description={instructors?.extra?.seo?.meta_description}
        keywords={instructors?.extra?.seo?.keywords}
        canonical={instructors?.extra?.seo?.canonical_url}
        ogImage={instructors?.extra?.seo?.og_image}
      />

      <main>
        <PageHead
          title={instructors?.extra?.instructors_hero?.title}
          description={instructors?.extra?.instructors_hero?.description}
        />

        <section className="container pagePadding space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* حقل البحث عن محاضر */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                البحث
              </label>
              <Input
                type="text"
                placeholder="ابحث عن محاضر"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* فلتر الأقسام */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                القسم
              </label>
              <Select
                disabled={categoriesLoading}
                value={currentCategory}
                onValueChange={(val) => updateFilters("category_id", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">كل الأقسام</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* حالة التحميل وعرض كروت المحاضرين */}
          {isLoading ? (
            <TeachersSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {instructors?.items?.map((item) => (
                  <TeacherCard key={item.id} teacher={item} />
                ))}
              </div>

              {instructors?.items?.length === 0 && (
                <EmptyDataSection msg="لا يوجد محاضرين" />
              )}
            </>
          )}

          <MainPagination
            totalPages={10}
            currentPage={1}
            onPageChange={() => {}}
          />
        </section>
      </main>
    </>
  );
};

export default Teachers;
