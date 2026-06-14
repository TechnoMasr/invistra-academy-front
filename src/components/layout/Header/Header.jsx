import logo from "@/assets/images/logo.png";
import { Link } from "react-router";
import HeaderActions from "./HeaderActions/HeaderActions";
import SearchInput from "./SearchInput";
import NavBar from "./NavBar";
import { useState } from "react";
import { useSelector } from "react-redux";

// استيراد مكونات الـ Sheet من Shadcn
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Header = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { settings } = useSelector((state) => state.settings);
  const { lang } = useSelector((state) => state.language);

  const links = [
    {
      id: 1,
      name: "المحاضرين",
      url: "/teachers",
      list: [],
    },
    {
      id: 2,
      name: "الكورسات",
      url: "/courses",
      list: [
        {
          id: 1,
          name: "الكورسات الحصرية",
          url: "/courses/online",
          list: [
            {
              id: 1,
              name: "كورس تصميم واجهات",
              url: "/courses/ui-ux",
            },
            {
              id: 2,
              name: "كورس تطوير المواقع",
              url: "/courses/web-dev",
            },
          ],
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="container py-2 flex justify-between items-center gap-2">
        {/* اللوجو */}
        <Link to="/" className="w-16 md:w-22">
          {settings?.header_logo && (
            <img
              loading="lazy"
              src={settings?.header_logo}
              alt="Company Logo"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          )}
        </Link>

        {/* السيرش للشاشات الكبيرة */}
        <div className="w-full max-w-xs hidden lg:block">
          <SearchInput />
        </div>

        {/* القائمة للشاشات الكبيرة */}
        <div className="hidden lg:block">
          <NavBar links={links} />
        </div>

        {/* أزرار التحكم (يحتوي على زر فتح المنيو للموبايل) */}
        <HeaderActions
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
        />
      </div>

      {/* --- Shadcn UI Sheet --- */}
      <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
        {/* side="right" يجعل الـ Sheet يفتح من اليمين ليتناسب مع اللغة العربية */}
        <SheetContent
          side={lang === "en" ? "right" : "left"}
          className="w-[300px] sm:w-[400px] flex flex-col gap-6 p-6"
        >
          {/* الهيدر الخاص بالـ Sheet */}
          <SheetHeader className=" border-b border-gray-100 pb-4">
            <SheetTitle>
              <Link
                to="/"
                onClick={() => setShowMobileNav(false)}
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

          {/* اللينكات وتنقلات الموبايل */}
          <nav className="flex flex-col gap-2 overflow-y-auto ">
            {links.map((link) => (
              <div key={link.id} className="flex flex-col gap-2">
                <Link
                  to={link.url}
                  className="text-gray-800 font-medium text-lg hover:text-primary transition-colors py-1"
                  onClick={() => setShowMobileNav(false)}
                >
                  {link.name}
                </Link>

                {/* اللينكات الفرعية (إن وجدت) */}
                {link.list && link.list.length > 0 && (
                  <div className="mr-4 border-r-2 border-gray-100 pr-3 flex flex-col gap-2">
                    {link.list.map((subLink) => (
                      <div key={subLink.id} className="flex flex-col gap-1">
                        <Link
                          to={subLink.url}
                          className="text-gray-600 text-sm hover:text-primary transition-colors"
                          onClick={() => setShowMobileNav(false)}
                        >
                          {subLink.name}
                        </Link>

                        {/* المستوى الثالث من اللينكات */}
                        {subLink.list &&
                          subLink.list.map((nestedLink) => (
                            <Link
                              key={nestedLink.id}
                              to={nestedLink.url}
                              className="text-gray-400 text-xs hover:text-primary transition-colors mr-2"
                              onClick={() => setShowMobileNav(false)}
                            >
                              - {nestedLink.name}
                            </Link>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
