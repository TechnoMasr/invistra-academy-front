import logo from "../../assets/images/logo.png";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-100">
      <div className="relative flex items-center justify-center">
        {/* حلقة التحميل الخارجية الدوارة */}
        <div className="bg-background w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/50 animate-spin"></div>

        {/* حاوية اللوجو الثابتة في المنتصف */}
        <div className="bg-background absolute w-26 h-26 md:w-34 md:h-34 p-2 rounded-full shadow-sm flex items-center justify-center">
          <img
            loading="lazy"
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain inset-0 brightness-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
