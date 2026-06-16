import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import CourseCard from "@/components/cards/CourseCard";
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
import { getCoursesPage } from "@/api/coursesServices";
import SeoManager from "@/utils/SeoManager";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import CoursesPageSkeleton from "@/components/Loading/SkeletonLoading/CoursesPageSkeleton";
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

const Courses = () => {
  // استخدام useSearchParams الخاصة بـ react-router
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL (مع إضافة الترقيم)
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category_id") || "all";
  const currentSubCategory = searchParams.get("sub_category_id") || "all";
  const currentInstructor = searchParams.get("instructor_id") || "all";
  const currentPage = Number(searchParams.get("page")) || 1; // قراءة الصفحة الحالية

  // State محلي للـ Input عشان الكتابة تكون سريعة وسلسة
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500); // ينتظر نصف ثانية بعد توقف الكتابة

  // جلب البيانات من Redux
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );
  const { instructors, instructorsLoading } = useSelector(
    (state) => state.instructors,
  );

  // استخراج الأقسام الفرعية بناءً على القسم الرئيسي المختار
  const selectedCategoryData = categories?.find(
    (cat) => String(cat.id) === currentCategory,
  );
  const availableSubCategories = selectedCategoryData?.sub_categories || [];

  // دالة لتحديث الـ URLParams مع الحفاظ على الفلاتر الأخرى
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key); // لو اختار "الكل" أو مسح السيرش بيتحذف من الـ URL تماماً
    }

    // لقطة ذكية: لو غيرنا القسم الرئيسي، لازم نمسح القسم الفرعي القديم من الـ URL
    if (key === "category_id") {
      newParams.delete("sub_category_id");
    }

    // تصفير الصفحة وإعادتها للأولى عند تغيير أي فلتر آخر غير الترقيم نفسه
    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  // مراقبة الـ Debounced Search أول ما يتغير يحدث الـ URL تلقائياً
  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  // عمل تزامن لو الـ URL اتغير من بره، الـ Input يتحدث
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب البيانات بناءً على الفلاتر الحالية في الـ URL
  const { data: courses, isLoading } = useQuery({
    // ربط الـ queryKey بكافة الفلاتر بما فيها الصفحة الحالية لعمل refetch تلقائي
    queryKey: [
      "courses-page",
      currentSearch,
      currentCategory,
      currentSubCategory,
      currentInstructor,
      currentPage, // أضيف هنا لمراقبة الترقيم
    ],
    queryFn: () =>
      getCoursesPage({
        search: currentSearch || undefined,
        category_id: currentCategory !== "all" ? currentCategory : undefined,
        sub_category_id:
          currentSubCategory !== "all" ? currentSubCategory : undefined,
        instructor_id:
          currentInstructor !== "all" ? currentInstructor : undefined,
        page: currentPage, // إرسال رقم الصفحة للـ API
      }),
  });

  // استخراج إجمالي عدد الصفحات ديناميكياً من الـ meta الخاصة بالسيرفر
  const totalPages = courses?.meta?.last_page || 1;

  return (
    <>
      <SeoManager
        title={courses?.extra?.seo?.meta_title}
        description={courses?.extra?.seo?.meta_description}
        keywords={courses?.extra?.seo?.keywords}
        canonical={courses?.extra?.seo?.canonical_url}
        ogImage={courses?.extra?.seo?.og_image}
      />

      <main>
        <PageHead
          title={courses?.extra?.courses_hero?.title}
          description={courses?.extra?.courses_hero?.description}
        />

        <section className="container pagePadding space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* حقل البحث */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                البحث
              </label>
              <Input
                type="text"
                placeholder="ابحث عن دورة"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* فلتر المحاضرين */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                المحاضر
              </label>
              <Select
                disabled={instructorsLoading}
                value={currentInstructor}
                onValueChange={(val) => updateFilters("instructor_id", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المحاضر" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">كل المحاضرين</SelectItem>
                    {instructors?.map((ins) => (
                      <SelectItem key={ins.id} value={String(ins.id)}>
                        {ins.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* فلتر الأقسام الرئيسية */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                القسم الرئيسي
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

            {/* فلتر الأقسام الفرعية */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                القسم الفرعي
              </label>
              <Select
                disabled={
                  currentCategory === "all" ||
                  availableSubCategories.length === 0
                }
                value={currentSubCategory}
                onValueChange={(val) => updateFilters("sub_category_id", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر القسم الفرعي" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">كل الأقسام الفرعية</SelectItem>
                    {availableSubCategories.map((subCat) => (
                      <SelectItem key={subCat.id} value={String(subCat.id)}>
                        {subCat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* حالة التحميل وعرض كروت الكورسات */}
          {isLoading ? (
            <CoursesPageSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses?.items?.map((item) => (
                  <CourseCard key={item.id} course={item} />
                ))}
              </div>

              {courses?.items?.length === 0 && (
                <EmptyDataSection msg={"لا يوجد كورسات"} />
              )}
            </>
          )}

          {/* الكومبوننت الفعلي للترقيم بعد ربطه */}
          <MainPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => updateFilters("page", page)}
          />
        </section>
      </main>
    </>
  );
};

export default Courses;
