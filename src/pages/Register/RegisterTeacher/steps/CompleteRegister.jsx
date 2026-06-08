import { useTranslation } from "react-i18next";
import doneImg from "../../../../assets/images/complete.png";

const CompleteRegister = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <img src={doneImg} alt="" className="w-32" />

      <h1 className="text-center text-2xl font-semibold">
        {t("CompleteRegister.title")}
      </h1>

      <p>{t("CompleteRegister.description")}</p>
    </div>
  );
};

export default CompleteRegister;
