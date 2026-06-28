import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const MobileNav = ({ open, onOpenChange, links, lang, settings }) => {
  const { t } = useTranslation();
  const isRtl = lang === "ar";

  // الاحتفاظ بمسار التنقل الشجري الحالي
  const [navStack, setNavStack] = useState([]);

  // تصفير الـ Stack عند إغلاق الـ القائمة بالكامل لتبدأ من جديد المرة القادمة
  useEffect(() => {
    if (!open) {
      setNavStack([]);
    }
  }, [open]);

  // العنصر النشط حالياً في القائمة (إذا كان الـ Stack يحتوي على عناصر، نأخذ آخر عنصر)
  const currentMenu =
    navStack.length > 0 ? navStack[navStack.length - 1] : null;

  // العودة خطوة للخلف في الشجرة
  const handleGoBack = () => {
    setNavStack((prev) => prev.slice(0, -1));
  };

  const handleCloseAll = () => {
    onOpenChange(false);
  };

  // دالة ذكية لبناء المسار (Path IDs) المطلوب لصفحة الكورسات بناءً على موقعنا في الشجرة والعنصر الحالي
  const buildCategoryPath = (currentItemId) => {
    // نأخذ الـ ids للعناصر الموجودة في الـ Stack (تجنب الروابط الرئيسية مثل 'الكورسات' إذا لم تكن تمتلك id للقسم)
    const activeStackIds = navStack
      .filter((item) => item.id && item.id !== "courses-root") // فلترة الجذور الوهمية إن وجدت
      .map((item) => item.id);

    return [...activeStackIds, currentItemId].join(",");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={lang === "en" ? "right" : "left"}
        className="w-75 sm:w-100 flex flex-col gap-6 p-6"
      >
        {/* رأس القائمة (اللوجو وهيدر العودة للخلف) */}
        <SheetHeader className="border-b border-gray-100 pb-4 px-0">
          <SheetTitle>
            {!currentMenu ? (
              // إذا كنا في القائمة الرئيسية، نعرض اللوجو
              <Link
                to="/"
                onClick={handleCloseAll}
                className="inline-block w-full"
              >
                {settings?.header_logo && (
                  <img
                    src={settings?.header_logo}
                    alt="Logo"
                    className="h-10 object-contain"
                  />
                )}
              </Link>
            ) : (
              // إذا دخلنا مستوى فرعي، نعرض زر العودة مع اسم القسم الحالي
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600"
                >
                  {isRtl ? (
                    <ArrowRight className="h-5 w-5" />
                  ) : (
                    <ArrowLeft className="h-5 w-5" />
                  )}
                </button>
                <span className="text-base font-bold text-gray-800 truncate">
                  {currentMenu.name}
                </span>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* جسم التنقل الديناميكي */}
        <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
          {!currentMenu ? (
            /* 1. عرض القائمة الرئيسية (المستوى الأول) */
            links.map((link) => {
              const hasList = link.list && link.list.length > 0;

              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 text-base font-bold text-gray-800"
                >
                  {hasList ? (
                    // لو جواه لستة، نضغط عليه فيفتح المستوى التالي (ندفعه للـ Stack)
                    <button
                      onClick={() =>
                        setNavStack([
                          {
                            id: "courses-root",
                            name: link.name,
                            sub_categories: link.list,
                          },
                        ])
                      }
                      className="flex items-center justify-between w-full text-start cursor-pointer hover:text-primary transition-colors"
                    >
                      {link.name}
                      {isRtl ? (
                        <ChevronLeft className="h-5 w-5 opacity-60" />
                      ) : (
                        <ChevronRight className="h-5 w-5 opacity-60" />
                      )}
                    </button>
                  ) : (
                    // لو ممش جواه لستة (زي المحاضرين)، يوجه مباشرة
                    <Link
                      to={link.url}
                      className="w-full hover:text-primary transition-colors"
                      onClick={handleCloseAll}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            /* 2. عرض القوائم الفرعية المتتالية (المستويات الأعمق) */
            <div className="flex flex-col gap-1">
              {/* خيار عرض الكل للقسم الحالي */}
              {currentMenu.id === "courses-root" ? (
                <div className="py-3 border-b border-gray-50 text-sm font-bold">
                  <Link
                    to="/courses" // يذهب لصفحة الكورسات بدون فلاتر
                    className="text-primary block w-full text-start"
                    onClick={handleCloseAll}
                  >
                    {t("all")} {currentMenu.name}
                  </Link>
                </div>
              ) : (
                /* أما إذا كنا في مستوى داخلي عميق (مثل Biology)، نعرض "كل الأحياء" بالـ Path الخاص بها */
                <div className="py-3 border-b border-gray-50 text-sm font-bold">
                  <Link
                    to={`/courses?category_path=${buildCategoryPath(currentMenu.id)}`}
                    className="text-primary block w-full text-start"
                    onClick={handleCloseAll}
                  >
                    {t("all")} {currentMenu.name}
                  </Link>
                </div>
              )}

              {/* تكرار العناصر الفرعية المتاحة في هذا المستوى */}
              {(currentMenu.sub_categories || currentMenu.list || []).map(
                (item) => {
                  const hasSubCategories =
                    item.sub_categories && item.sub_categories.length > 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-gray-50 text-sm font-medium text-gray-700"
                    >
                      {hasSubCategories ? (
                        // لو القسم الفرعي جواه تفريعات أكتر، الزر يدخلنا عمق أكتر بالـ Stack
                        <button
                          onClick={() => setNavStack((prev) => [...prev, item])}
                          className="flex items-center justify-between gap-2 w-full text-start cursor-pointer hover:text-primary transition-colors"
                        >
                          {item.name}
                          <div className="text-primary">
                            {isRtl ? (
                              <ChevronLeft className="h-4 w-4 opacity-60" />
                            ) : (
                              <ChevronRight className="h-4 w-4 opacity-60" />
                            )}
                          </div>
                        </button>
                      ) : (
                        // لو مفيش جواه حاجة، يروح فوراً على صفحة الفلترة بالـ Path كامل
                        <Link
                          to={`/courses?category_path=${buildCategoryPath(item.id)}`}
                          className="w-full hover:text-primary transition-colors text-start"
                          onClick={handleCloseAll}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
