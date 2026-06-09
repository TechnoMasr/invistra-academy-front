import { HiOutlineFolderOpen } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const EmptyDataSection = ({ msg }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-4 min-h-60
      text-primary text-center text-lg font-semibold capitalize"
    >
      <HiOutlineFolderOpen className="text-[150px] animate-pulse" />

      <p>{msg || t("noDataFound")}</p>
    </div>
  );
};

export default EmptyDataSection;
