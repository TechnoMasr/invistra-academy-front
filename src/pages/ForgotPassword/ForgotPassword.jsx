import { useState } from "react";
import { useTranslation } from "react-i18next";

import CheckEmail from "./sections/CheckEmail";
import OTP from "./sections/OTP";
import ResetPassword from "./sections/ResetPassword";
import AuthContainer from "@/components/form/AuthContainer";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t("ForgotPassword.step1Title"),
      description: t("ForgotPassword.step1Description"),
    },
    {
      id: 2,
      title: t("ForgotPassword.step2Title"),
      description: t("ForgotPassword.step2Description"),
    },
    {
      id: 3,
      title: t("ForgotPassword.step3Title"),
      description: t("ForgotPassword.step3Description"),
    },
  ];

  const [step, setStep] = useState(1);
  const [parentData, setParentData] = useState({});

  const goNext = () => {
    if (step >= steps.length) return;
    setStep((prev) => prev + 1);
  };

  return (
    <AuthContainer
      title={steps.find((s) => s.id === step)?.title}
      description={steps.find((s) => s.id === step)?.description}
    >
      {step === 1 && (
        <CheckEmail
          setParentData={setParentData}
          parentData={parentData}
          goNext={goNext}
        />
      )}
      {step === 2 && (
        <OTP
          setParentData={setParentData}
          parentData={parentData}
          goNext={goNext}
        />
      )}
      {step === 3 && (
        <ResetPassword setParentData={setParentData} parentData={parentData} />
      )}
    </AuthContainer>
  );
};

export default ForgotPassword;
