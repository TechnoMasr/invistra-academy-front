import logo from "@/assets/images/logo.png";
import { Link } from "react-router";
import HeaderActions from "./HeaderActions/HeaderActions";
import SearchInput from "./SearchInput";
import NavBar from "./NavBar";
import { useState } from "react";

const Header = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);

  // const { settings } = useSelector((state) => state.settings);

  return (
    <header className={`sticky top-0 left-0 w-full z-50 bg-primary `}>
      <div className="container py-4 flex justify-between items-center gap-2">
        <Link to="/" className="w-16 md:w-22">
          <img
            loading="lazy"
            src={logo}
            alt="Company Logo"
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="w-full max-w-xs hidden lg:block">
          <SearchInput />
        </div>

        <div className="hidden lg:block">
          <NavBar />
        </div>

        <HeaderActions
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
        />
      </div>

      <div
        className={`container flex flex-col items-center gap-2 lg:hidden max-h-0 overflow-hidden transition-all duration-300 ease-in-out
        ${showMobileNav ? "max-h-40 py-4" : ""}`}
      >
        <NavBar col />
      </div>
    </header>
  );
};

export default Header;
