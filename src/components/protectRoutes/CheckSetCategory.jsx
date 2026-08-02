import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { CiWarning } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const CheckSetCategory = ({ children }) => {
  const { t } = useTranslation();
  const { user } = useSelector((s) => s.auth);

  if (user?.type === "instructor" && !user?.category?.id) {
    return (
      <section className="h-[90vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="modal_icon">
          <CiWarning />
        </div>

        <h1 className="text-2xl ">{t("requiredSetCategoryModal.title")}</h1>

        <h2 className="font-semibold">{t("requiredSetCategoryModal.description")}</h2>

        <Link to="/profile" replace>
          <Button>{t("requiredSetCategoryModal.goToProfile")}</Button>
        </Link>
      </section>
    );
  }

  return children;
};

export default CheckSetCategory;
