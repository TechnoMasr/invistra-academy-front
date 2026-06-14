import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "@/store/languageSlice/languageSlice";
import { openModal } from "@/store/modals/modalsSlice";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.language);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const handleToggle = () => {
    dispatch(changeLanguage(lang === "ar" ? "en" : "ar"));
    dispatch(openModal({ modalName: "loadingModal" }));
  };

  return (
    <Button onClick={handleToggle} size="icon" className="rounded-full">
      {lang === "en" ? "AR" : "EN"}
    </Button>
  );
};

export default LanguageSwitcher;
