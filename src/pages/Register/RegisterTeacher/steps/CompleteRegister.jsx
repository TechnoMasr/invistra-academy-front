import { useTranslation } from "react-i18next";
import doneImg from "../../../../assets/images/complete.png";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const CompleteRegister = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <img src={doneImg} alt="" className="w-32" />

      <h1 className="text-center text-2xl font-semibold">
        {t("CompleteRegister.title")}
      </h1>

      <p>{t("CompleteRegister.description")}</p>

      <Link to="/">
        <Button>{t("CompleteRegister.goHome")}</Button>
      </Link>
    </div>
  );
};

export default CompleteRegister;
