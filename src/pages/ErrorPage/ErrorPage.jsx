import { Link, useRouteError } from "react-router";
import { useTranslation } from "react-i18next";
import { CiWarning } from "react-icons/ci";
import { AiFillHome } from "react-icons/ai";
import { RxReload } from "react-icons/rx";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();

  return (
    <section className="h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <CiWarning className="text-[120px] text-primary" />

      <h2 className="text-2xl ">{t("ErrorPage.title")}</h2>

      <p className="text-primary font-semibold max-w-md">
        {error?.message || t("ErrorPage.description")}
      </p>

      <div className="flex items-center justify-center flex-wrap gap-3 mt-4">
        <Button variant={`outline`} onClick={() => window.location.reload()}>
          {t("ErrorPage.reload")} <RxReload />
        </Button>

        <Link to="/" replace>
          <Button>
            {t("ErrorPage.goHome")} <AiFillHome />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
