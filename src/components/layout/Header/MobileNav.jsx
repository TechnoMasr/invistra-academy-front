import React from "react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MobileNav = ({ open, onOpenChange, links, lang, settings }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={lang === "en" ? "right" : "left"}
        className="w-[300px] sm:w-[400px] flex flex-col gap-6 p-6"
      >
        {/* رأس القائمة (اللوجو) */}
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle>
            <Link
              to="/"
              onClick={() => onOpenChange(false)}
              className="inline-block w-14"
            >
              {settings?.header_logo && (
                <img
                  src={settings?.header_logo}
                  alt="Logo"
                  className="w-full object-contain"
                />
              )}
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* القائمة المتداخلة بالكامل */}
        <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
          {/* الأكورديون الرئيسي للمستوى الأول (المحاضرين / الكورسات) */}
          <Accordion type="single" collapsible className="w-full">
            {links.map((link) => {
              const hasCategories = link.list && link.list.length > 0;

              // رابط عادي لو مفيش جواه لستة (مثل المحاضرين)
              if (!hasCategories) {
                return (
                  <div key={link.id} className="py-3 border-b border-gray-100">
                    <Link
                      to={link.url}
                      className="text-gray-800 font-bold text-base hover:text-primary transition-colors block w-full text-right"
                      onClick={() => onOpenChange(false)}
                    >
                      {link.name}
                    </Link>
                  </div>
                );
              }

              // إذا كان لديه أقسام (مثل الكورسات)
              return (
                <AccordionItem
                  key={link.id}
                  value={`link-${link.id}`}
                  className="border-b border-gray-100"
                >
                  <AccordionTrigger className="text-gray-800 font-bold text-base hover:text-primary hover:no-underline py-3 text-right">
                    {link.name}
                  </AccordionTrigger>

                  <AccordionContent className="pt-1 pb-3 flex flex-col gap-2">
                    {/* زر لعرض كل الكورسات مباشرة */}
                    <Link
                      to={link.url}
                      className="text-primary font-semibold text-sm py-2 block border-b border-dashed border-gray-100"
                      onClick={() => onOpenChange(false)}
                    >
                      كل {link.name}
                    </Link>

                    {/* الأكورديون الثاني للمستوى الثاني (الأقسام الرئيسية) */}
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mr-2 pr-2 border-r-2 border-gray-100 flex flex-col gap-1"
                    >
                      {link.list.map((category) => {
                        const hasSubCategories =
                          category.sub_categories &&
                          category.sub_categories.length > 0;

                        // لو القسم الرئيسي مفيش جواه أقسام فرعية
                        if (!hasSubCategories) {
                          return (
                            <Link
                              key={category.id}
                              to={`/courses?category_id=${category.id}`}
                              className="text-gray-700 font-medium text-sm hover:text-primary transition-colors py-2 block text-right"
                              onClick={() => onOpenChange(false)}
                            >
                              {category.name}
                            </Link>
                          );
                        }

                        // لو القسم الرئيسي جواه أقسام فرعية، نعمله هو كمان AccordionItem
                        return (
                          <AccordionItem
                            key={category.id}
                            value={`cat-${category.id}`}
                            className="border-none"
                          >
                            <AccordionTrigger className="text-gray-700 font-medium text-sm hover:text-primary hover:no-underline py-2 text-right">
                              {category.name}
                            </AccordionTrigger>

                            <AccordionContent className="pt-1 pb-2 flex flex-col gap-1.5 mr-3 pr-2 border-r border-gray-200">
                              {/* رابط للذهاب للقسم الرئيسي نفسه */}
                              <Link
                                to={`/courses?category_id=${category.id}`}
                                className="text-gray-400 font-medium text-xs hover:text-primary transition-colors py-1 block"
                                onClick={() => onOpenChange(false)}
                              >
                                عرض كل {category.name}
                              </Link>

                              {/* عرض الأقسام الفرعية (المستوى الثالث) */}
                              {category.sub_categories.map((subCategory) => (
                                <Link
                                  key={subCategory.id}
                                  to={`/courses?category_id=${category.id}&sub_category_id=${subCategory.id}`}
                                  className="text-gray-600 text-xs hover:text-primary transition-colors py-1 block"
                                  onClick={() => onOpenChange(false)}
                                >
                                  - {subCategory.name}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
