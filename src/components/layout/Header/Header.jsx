import logo from "@/assets/images/logo.png";
import { Link } from "react-router";
import HeaderActions from "./HeaderActions/HeaderActions";
import SearchInput from "./SearchInput";
import NavBar from "./NavBar";
import { useState } from "react";
import { useSelector } from "react-redux";

import MobileNav from "./MobileNav";

const Header = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { settings } = useSelector((state) => state.settings);
  const { lang } = useSelector((state) => state.language);
  const { categories } = useSelector((state) => state.categories);

  const links = [
    {
      id: 1,
      name: "المحاضرين",
      url: "/instructors",
      list: [],
    },
    {
      id: 2,
      name: "الكورسات",
      url: "/courses",
      list: categories || [],
    },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="container py-2 flex justify-between items-center gap-2">
        {/* اللوجو */}
        <Link to="/" className="w-24 md:w-28 h-10">
          <img
            loading="lazy"
            src={logo}
            alt="Company Logo"
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />

          {/* {settings?.header_logo && (
            <img
              loading="lazy"
              src={settings?.header_logo}
              alt="Company Logo"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          )} */}
        </Link>

        {/* السيرش للشاشات الكبيرة */}
        <div className="w-full max-w-xs hidden lg:block">
          <SearchInput />
        </div>

        {/* القائمة للشاشات الكبيرة */}
        <div className="hidden lg:block">
          <NavBar links={links} />
        </div>

        {/* أزرار التحكم */}
        <HeaderActions
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
        />
      </div>

      {/* --- Shadcn UI Sheet للموبايل --- */}
      <MobileNav
        open={showMobileNav}
        onOpenChange={setShowMobileNav}
        links={links}
        lang={lang}
        settings={settings}
      />
    </header>
  );
};

export default Header;
