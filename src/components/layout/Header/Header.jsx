import { Link } from "react-router";
import HeaderActions from "./HeaderActions/HeaderActions";
import SearchInput from "./SearchInput";
import NavBar from "./NavBar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MobileNav from "./MobileNav";

const Header = () => {
  const { t } = useTranslation();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { settings } = useSelector((state) => state.settings);
  const { lang } = useSelector((state) => state.language);
  const { categories } = useSelector((state) => state.categories);

  const links = [
    {
      id: 1,
      name: t("header.instructors"),
      url: "/instructors",
      list: [],
    },
    {
      id: 2,
      name: t("header.courses"),
      url: "/courses",
      list: categories || [],
    },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="container py-2 flex justify-between items-center gap-2">
        <Link to="/" className="w-30 md:w-40 h-10">
          {settings?.header_logo && (
            <img
              loading="lazy"
              src={settings?.header_logo}
              alt="Company Logo"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          )}
        </Link>

        <div className="w-full max-w-xs hidden xl:block">
          <SearchInput />
        </div>

        <div className="hidden xl:block">
          <NavBar links={links} />
        </div>

        <HeaderActions
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
        />
      </div>

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
