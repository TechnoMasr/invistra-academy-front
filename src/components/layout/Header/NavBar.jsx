import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const NavBar = ({ links }) => {
  const { t } = useTranslation();
  const { lang } = useSelector((state) => state.language);
  const location = useLocation();

  const isRtl = lang === "ar";

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [navStack, setNavStack] = useState([]);
  const navRef = useRef(null);

  const toggleDropdown = (id) => {
    if (openDropdownId === id) {
      closeAll();
    } else {
      setOpenDropdownId(id);
      setNavStack([]);
    }
  };

  const closeAll = () => {
    setOpenDropdownId(null);
    setNavStack([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentSubMenu =
    navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const handleGoBack = () => {
    setNavStack((prev) => prev.slice(0, -1));
  };

  return (
    <nav ref={navRef} className="flex items-center gap-4 relative">
      {links.map((link) => {
        const isDropdownOpen = openDropdownId === link.id;
        const hasList = link.list && link.list.length > 0;

        // التحقق من أن المسار الحالي يطابق رابط هذا الـ Dropdown (مثلاً يبدأ بـ /courses)
        const isParentActive = location.pathname.startsWith(link.url);

        if (hasList) {
          return (
            <div key={link.id} className="relative">
              {/* إضافة كلاس active هنا بناءً على الشرط */}
              <button
                onClick={() => toggleDropdown(link.id)}
                className={`nav_link flex items-center gap-1 focus:outline-none cursor-pointer ${
                  isParentActive ? "active" : ""
                }`}
              >
                {link.name}
                <ChevronDown
                  className={`h-4 w-4 opacity-70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute inset-s-0 mt-2 w-[16rem] bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col justify-between">
                  {/* القائمة الرئيسية الأولى للدروب داون */}
                  <div className="flex-1 py-1">
                    <NavLink
                      to={link.url}
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm font-bold border-b border-gray-100 hover:bg-gray-50"
                    >
                      {t("all")} {link.name}
                    </NavLink>

                    {link.list.map((category) => {
                      const hasSubCategories =
                        category.sub_categories &&
                        category.sub_categories.length > 0;

                      return (
                        <div
                          key={category.id}
                          onMouseEnter={() => {
                            if (hasSubCategories) {
                              setNavStack([category]);
                            } else {
                              setNavStack([]);
                            }
                          }}
                          className="relative"
                        >
                          <div
                            className={`flex items-center justify-between text-sm hover:bg-gray-50 cursor-pointer`}
                          >
                            <NavLink
                              to={`/courses?category_path=${category.id}`}
                              onClick={closeAll}
                              className="flex-1 px-4 py-2 text-start"
                            >
                              {category.name}
                            </NavLink>
                            {hasSubCategories && (
                              <span className="px-3 py-2 text-gray-400">
                                <ChevronRight className="h-4 w-4 ltr:block rtl:hidden" />
                                <ChevronLeft className="h-4 w-4 rtl:block ltr:hidden" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* القائمة الفرعية الديناميكية */}
                  {currentSubMenu && (
                    <div className="absolute top-0 ltr:left-full rtl:right-full w-60 h-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-y-auto flex flex-col">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700">
                        <button
                          onClick={handleGoBack}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                          title={t("header.back") || "Back"}
                        >
                          {isRtl ? (
                            <ArrowRight className="h-4 w-4" />
                          ) : (
                            <ArrowLeft className="h-4 w-4" />
                          )}
                        </button>
                        <span className="truncate flex-1">
                          {currentSubMenu.name}
                        </span>
                      </div>

                      <div className="py-1 flex-1">
                        {currentSubMenu.sub_categories &&
                          currentSubMenu.sub_categories.map((subItem) => {
                            const hasMoreSubs =
                              subItem.sub_categories &&
                              subItem.sub_categories.length > 0;

                            const currentPathIds = [
                              ...navStack.map((item) => item.id),
                              subItem.id,
                            ].join(",");

                            return (
                              <div
                                key={subItem.id}
                                className="flex items-center justify-between text-sm hover:bg-gray-50 cursor-pointer"
                              >
                                <NavLink
                                  to={`/courses?category_path=${currentPathIds}`}
                                  onClick={closeAll}
                                  className="flex-1 px-4 py-2 text-start"
                                >
                                  {subItem.name}
                                </NavLink>

                                {hasMoreSubs && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNavStack((prev) => [...prev, subItem]);
                                    }}
                                    className="px-3 py-2 bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 h-full"
                                  >
                                    <ChevronRight className="h-5 w-5 ltr:block rtl:hidden" />
                                    <ChevronLeft className="h-5 w-5 rtl:block ltr:hidden" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
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
