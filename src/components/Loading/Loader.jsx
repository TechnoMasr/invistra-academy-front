import { useTranslation } from "react-i18next";
import { GiCoffeeBeans } from "react-icons/gi";
import logo from "../../assets/images/logo.png";

const Loader = ({ textWhite = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-75">
      {/* <GiCoffeeBeans className="text-7xl text-primary animate-bounce" /> */}

      <img
        src={logo}
        className="inset-0 brightness-0 animate-bounce w-32 lg:w-40"
      />

      {/* <h2
        className={`text-lg font-semibold ${textWhite ? "text-white" : "text-black"}`}
      >
        {t("loading")}
      </h2> */}
    </div>
  );
};

export default Loader;
