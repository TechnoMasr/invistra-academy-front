import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/Loading/LoadingPage";
import { CiWarning } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const CheckVerifiedEmailGuard = ({ children }) => {
  const { t } = useTranslation();
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <LoadingPage />;

  if (!user?.is_verified) {
    return (
      <section className="h-[90vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="modal_icon">
          <CiWarning />
        </div>

        <h1 className="text-2xl ">{t("checkVerifiedEmailGuard.title")}</h1>

        <h2 className="font-semibold">
          {t("checkVerifiedEmailGuard.description")}
        </h2>

        <Link to="/verify-email" replace>
          <Button>{t("checkVerifiedEmailGuard.button")}</Button>
        </Link>
      </section>
    );
  }

  return children;
};

export default CheckVerifiedEmailGuard;
