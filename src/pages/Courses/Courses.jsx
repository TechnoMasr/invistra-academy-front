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
import {
  getCategoriesList,
  getCoursesPage,
  getInstructorsList,
} from "@/api/coursesServices";
import SeoManager from "@/utils/SeoManager";
import { Input } from "@/components/ui/input";

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
  // استخدام useSearchParams الخاصة بـ react-router-dom
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category_id") || "all";
  const currentInstructor = searchParams.get("instructor_id") || "all";

  // State محلي للـ Input عشان الكتابة تكون سريعة وسلسة
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500); // ينتظر نصف ثانية بعد توقف الكتابة

  // دالة لتحديث الـ URLParams مع الحفاظ على الفلاتر الأخرى
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key); // لو اختار "الكل" أو مسح السيرش بيتحذف من الـ URL تماماً
    }

    setSearchParams(newParams);
  };

  // مراقبة الـ Debounced Search أول ما يتغير يحدث الـ URL تلقائياً
  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  // عمل تزامن لو الـ URL اتغير من بره (مثلا زرار كنسل الفلتر أو back)، الـ Input يتحدث
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب البيانات بناءً على الفلاتر الحالية في الـ URL
  const { data: courses, isLoading } = useQuery({
    // ربط الـ queryKey بالفلاتر عشان أول ما الـ URL يتغير الـ useQuery يشتغل فوراً ويعمل ريفرش
    queryKey: [
      "courses-page",
      currentSearch,
      currentCategory,
      currentInstructor,
    ],
    queryFn: () =>
      getCoursesPage({
        search: currentSearch || undefined,
        category_id: currentCategory !== "all" ? currentCategory : undefined,
        instructor_id:
          currentInstructor !== "all" ? currentInstructor : undefined,
      }),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories-list"],
    queryFn: getCategoriesList,
  });

  const { data: instructors, isLoading: instructorsLoading } = useQuery({
    queryKey: ["instructors-list"],
    queryFn: getInstructorsList,
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* حقل البحث */}
            <div className="md:col-span-2 lg:col-span-1">
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
          </div>

          {/* حالة التحميل وعرض كروت الكورسات */}
          {isLoading ? (
            <div className="text-center py-10">جاري تحميل الدورات...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses?.items?.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
              {courses?.items?.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  لا توجد نتائج تطابق خيارات البحث الحالية.
                </div>
              )}
            </div>
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

export default Courses;
