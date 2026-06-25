// import { useTranslation } from "react-i18next";
// import { GiCoffeeBeans } from "react-icons/gi";
// import logo from "../../assets/images/logo.png";

// const Loader = ({ textWhite = false }) => {
//   const { t } = useTranslation();

//   return (
//     <div className="flex flex-col items-center justify-center gap-4 min-h-75">
//       {/* <GiCoffeeBeans className="text-7xl text-primary animate-bounce" /> */}

//       <img
//         src={logo}
//         className="inset-0 brightness-0 animate-bounce w-32 lg:w-40"
//       />

//       {/* <h2
//         className={`text-lg font-semibold ${textWhite ? "text-white" : "text-black"}`}
//       >
//         {t("loading")}
//       </h2> */}
//     </div>
//   );
// };

// export default Loader;

import { useTranslation } from "react-i18next";
import logo from "../../assets/images/logo.png";

const Loader = ({ textWhite = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        {/* حلقة التحميل الخارجية الدوارة */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/50 animate-spin"></div>

        {/* حاوية اللوجو الثابتة في المنتصف */}
        <div className="absolute w-26 h-26 md:w-34 md:h-34 p-2 rounded-full shadow-sm flex items-center justify-center">
          <img
            loading="lazy"
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain inset-0 brightness-0"
          />
        </div>
      </div>

      {/* نص التحميل الذكي */}
      {/* <div className="flex flex-col items-center gap-1">
        <h2
          className={`text-xl font-bold tracking-wide ${textWhite ? "text-white" : "text-slate-800"}`}
        >
          {t("loading")}...
        </h2>
      </div> */}
    </div>
  );
};

export default Loader;
