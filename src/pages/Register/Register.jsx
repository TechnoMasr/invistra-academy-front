import AuthContainer from "@/components/form/AuthContainer";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { GiTeacher } from "react-icons/gi";
import { PiStudentDuotone } from "react-icons/pi";

const Register = () => {
  const { t } = useTranslation();

  const list = [
    {
      id: 1,
      title: t("registerPage.student"),
      link: "/register/student",
      icon: <PiStudentDuotone />,
    },
    {
      id: 2,
      title: t("registerPage.teacher"),
      link: "/register/teacher",
      icon: <GiTeacher />,
    },
  ];

  return (
    <AuthContainer
      title={t("registerPage.title")}
      description={t("registerPage.description")}
    >
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mx-auto">
        {list.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="flex flex-col items-center gap-2 border border-gray-400 p-4 rounded-lg group"
          >
            <div
              className="text-7xl text-primary bg-secondary w-full aspect-square 
              flex items-center justify-center rounded-lg group-hover:bg-primary group-hover:text-secondary transition-all duration-200"
            >
              {item.icon}
            </div>

            <p className="text-lg font-semibold">{item.title}</p>
          </Link>
        ))}
      </div>

      <div className="text-center text-sm">
        {t("registerPage.alreadyHaveAccount")}
        <Link to="/login" className="text-sky-600 hover:underline ms-1">
          {t("registerPage.signInHere")}
        </Link>
      </div>
    </AuthContainer>
  );
};

export default Register;
