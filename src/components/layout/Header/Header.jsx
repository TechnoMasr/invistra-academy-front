import logo from "@/assets/images/logo.png";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Header = () => {
  // const { settings } = useSelector((state) => state.settings);

  return (
    <header className={`sticky top-0 left-0 w-full z-50 bg-primary `}>
      <div className="container py-4 flex justify-between items-center">
        <Link to="/" className="w-22 md:w-22">
          <img
            loading="lazy"
            src={logo}
            alt="Company Logo"
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* <HeaderActions /> */}
      </div>
    </header>
  );
};

export default Header;
