import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
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

// Custom Hook للـ Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Courses = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم من الـ URL
  const currentSearch = searchParams.get("search") || "";
  const currentInstructor = searchParams.get("instructor_id") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  // قراءة مسار الأقسام من الـ URL
  const categoryPathString = searchParams.get("category_path") || "";
  const selectedCategories = categoryPathString
    ? categoryPathString.split(",")
    : [];

  // الـ ID الفعلي المختار حالياً لإرساله للـ API
  const activeCategoryId =
    selectedCategories[selectedCategories.length - 1] || "all";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  // جلب البيانات من Redux
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );
  const { instructors, instructorsLoading } = useSelector(
    (state) => state.instructors,
  );

  // بناء قائمة المستويات المتاحة للعرض ديناميكياً مع تعديل المسميات
  const renderLevels = [];
  let currentLevelOptions = categories || [];

  // المستوى الأول دائماً متاح (الأقسام الرئيسية)
  renderLevels.push({
    levelIndex: 0,
    options: currentLevelOptions,
    selectedValue: selectedCategories[0] || "all",
    parentName: "", // لا يوجد أب للمستوى الأول
  });

  // تتبع شجرة الأقسام لبناء القوائم الفرعية التالية وحفظ اسم الأب المختار
  for (let i = 0; i < selectedCategories.length; i++) {
    const selectedId = selectedCategories[i];
    const foundCategory = currentLevelOptions.find(
      (cat) => String(cat.id) === selectedId,
    );

    if (
      foundCategory &&
      foundCategory.sub_categories &&
      foundCategory.sub_categories.length > 0
    ) {
      currentLevelOptions = foundCategory.sub_categories;
      renderLevels.push({
        levelIndex: i + 1,
        options: currentLevelOptions,
        selectedValue: selectedCategories[i + 1] || "all",
        parentName: foundCategory.name, // حفظ اسم القسم المختار ليصبح عنواناً للمستوى الفرعي
      });
    } else {
      break;
    }
  }

  // دالة تحديث الفلاتر الشاملة
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  // دالة خاصة بالتعامل مع تغيير الأقسام الشجرية
  const handleCategoryChange = (levelIndex, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === "all") {
      const newPath = selectedCategories.slice(0, levelIndex);
      if (newPath.length > 0) {
        newParams.set("category_path", newPath.join(","));
      } else {
        newParams.delete("category_path");
      }
    } else {
      const newPath = [...selectedCategories.slice(0, levelIndex), value];
      newParams.set("category_path", newPath.join(","));
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  useEffect(() => {
    updateFilters("search", debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // جلب البيانات بناءً على الـ ID النشط من السلسلة
  const { data: courses, isLoading } = useQuery({
    queryKey: [
      "courses-page",
      currentSearch,
      activeCategoryId,
      currentInstructor,
      currentPage,
    ],
    queryFn: () =>
      getCoursesPage({
        search: currentSearch || undefined,
        category_id: activeCategoryId !== "all" ? activeCategoryId : undefined,
        instructor_id:
          currentInstructor !== "all" ? currentInstructor : undefined,
        page: currentPage,
      }),
  });

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
                {t("coursesPage.search")}
              </label>
              <Input
                type="text"
                placeholder={t("coursesPage.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* فلتر المحاضرين */}
            <div>
              <label className="text-sm font-medium inline-block mb-2">
                {t("coursesPage.instructor")}
              </label>
              <Select
                disabled={instructorsLoading}
                value={currentInstructor}
                onValueChange={(val) => updateFilters("instructor_id", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("coursesPage.instructorPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">
                      {t("coursesPage.allInstructors")}
                    </SelectItem>
                    {instructors?.map((ins) => (
                      <SelectItem key={ins.id} value={String(ins.id)}>
                        {ins.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* عرض قوائم الأقسام ديناميكياً بالمسميات الجديدة */}
            {renderLevels.map((level) => (
              <div key={level.levelIndex}>
                <label className="text-sm font-medium inline-block mb-2">
                  {level.levelIndex === 0
                    ? t("coursesPage.mainCategory")
                    : level.parentName}
                </label>
                <Select
                  disabled={categoriesLoading}
                  value={level.selectedValue}
                  onValueChange={(val) =>
                    handleCategoryChange(level.levelIndex, val)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("coursesPage.categoryPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectItem value="all">
                        {level.levelIndex === 0
                          ? t("coursesPage.allCategories")
                          : `${t("all")} ${level.parentName}`}
                      </SelectItem>
                      {level.options?.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* عرض البيانات أو الهيكل العظمي للتحميل */}
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
                <EmptyDataSection msg={t("coursesPage.noCourses")} />
              )}
            </>
          )}

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
