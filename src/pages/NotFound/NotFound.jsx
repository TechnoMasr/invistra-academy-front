import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { AiFillHome } from "react-icons/ai";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <section className="h-[90vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-7xl ">{t("notFound.title")}</h1>
      <h2 className="text-2xl ">{t("notFound.subtitle")}</h2>

      <Link to="/" replace>
        <Button>
          {t("notFound.goHome")} <AiFillHome />
        </Button>
      </Link>
    </section>
  );
};

export default NotFound;
