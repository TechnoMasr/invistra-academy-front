import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const NavBar = ({ links }) => {
  const { t } = useTranslation();

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // 1. إنشاء مرجع (Ref) لمراقبة شجرة عناصر الـ Navbar
  const navRef = useRef(null);

  const toggleDropdown = (id) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      setActiveCategory(null);
    } else {
      setOpenDropdownId(id);
      setActiveCategory(null);
    }
  };

  const closeAll = () => {
    setOpenDropdownId(null);
    setActiveCategory(null);
  };

  // 2. مراقبة الضغط خارج القائمة
  useEffect(() => {
    const handleClickOutside = (event) => {
      // إذا كانت القائمة مفتوحة والضغطة تمت خارج عنصر الـ navRef
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAll();
      }
    };

    // تسجيل الحدث عند تركيب المكون (Mount)
    document.addEventListener("mousedown", handleClickOutside);

    // تنظيف الحدث عند فك المكون (Unmount) لمنع تسريب الذاكرة
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // 3. نربط الـ ref بالـ <nav> الأساسي ليغطي كل الدروب داونز
    <nav ref={navRef} className="flex items-center gap-4 relative">
      {links.map((link) => {
        const isDropdownOpen = openDropdownId === link.id;
        const hasList = link.list && link.list.length > 0;

        if (hasList) {
          return (
            <div key={link.id} className="relative">
              <button
                onClick={() => toggleDropdown(link.id)}
                className="nav_link flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                {link.name}
                <ChevronDown
                  className={`h-4 w-4 opacity-70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[16rem] bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col justify-between">
                  <div className="flex-1 py-1">
                    <NavLink
                      to={link.url}
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm font-bold border-b border-gray-100 hover:bg-gray-50"
                    >
                      {t("header.all")} {link.name}
                    </NavLink>

                    {link.list.map((category) => {
                      const hasSubCategories =
                        category.sub_categories &&
                        category.sub_categories.length > 0;
                      const isCategoryActive =
                        activeCategory?.id === category.id;

                      return (
                        <div
                          key={category.id}
                          // إذا كانت تحتوي على فروع نفتحها، وإذا كانت عادية نصفر القائمة لتختفي القديمة
                          onMouseEnter={() =>
                            hasSubCategories
                              ? setActiveCategory(category)
                              : setActiveCategory(null)
                          }
                          className="relative"
                        >
                          {hasSubCategories ? (
                            <div
                              className={`flex items-center justify-between text-sm hover:bg-gray-50 cursor-pointer ${isCategoryActive ? "bg-gray-50" : ""}`}
                            >
                              <NavLink
                                to={`/courses?category_id=${category.id}`}
                                onClick={closeAll}
                                className="flex-1 px-4 py-2"
                              >
                                {category.name}
                              </NavLink>
                              <span className="px-3 py-2 text-gray-400">
                                <ChevronRight className="h-4 w-4 ltr:block rtl:hidden" />
                                <ChevronLeft className="h-4 w-4 rtl:block ltr:hidden" />
                              </span>
                            </div>
                          ) : (
                            <NavLink
                              to={`/courses?category_id=${category.id}`}
                              onClick={closeAll}
                              className="block px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              {category.name}
                            </NavLink>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {activeCategory && (
                    <div
                      className="absolute top-0 ltr:left-full rtl:right-full w-[14rem] h-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-y-auto flex flex-col"
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="py-1">
                        <p className="px-4 py-2 text-xs font-semibold border-b border-gray-100">
                          {t("header.subCategories")}
                        </p>
                        {activeCategory.sub_categories.map((subItem) => (
                          <NavLink
                            key={subItem.id}
                            to={`/courses?category_id=${activeCategory.id}&sub_category_id=${subItem.id}`}
                            onClick={closeAll}
                            className="block px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        return (
          <NavLink key={link.id} to={link.url} className="nav_link">
            {link.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default NavBar;
