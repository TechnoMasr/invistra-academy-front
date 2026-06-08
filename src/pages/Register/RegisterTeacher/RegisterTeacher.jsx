import StepProgress from "@/components/common/StepProgress";
import AuthContainer from "@/components/form/AuthContainer";
import { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import CompleteRegister from "./steps/CompleteRegister";
import { useTranslation } from "react-i18next";

const RegisterTeacher = () => {
  const { t } = useTranslation();
  const steps = [1, 2];

  const [completed, setCompleted] = useState(false);
  const [step, setStep] = useState(1);

  const goNext = () => {
    if (step >= steps.length) {
      setCompleted(true);
      return;
    }

    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const [parentData, setParentData] = useState({});

  return (
    <AuthContainer
      title={t("RegisterTeacher.createAccount")}
      description={t("RegisterTeacher.enterDetails")}
      showTitle={!completed}
    >
      {completed ? (
        <CompleteRegister />
      ) : (
        <>
          <StepProgress
            steps={steps}
            currentStep={step}
            onStepClick={setStep}
          />

          {step === 1 && (
            <Step1
              setParentData={setParentData}
              parentData={parentData}
              goNext={goNext}
            />
          )}

          {step === 2 && (
            <Step2
              setParentData={setParentData}
              parentData={parentData}
              goNext={goNext}
            />
          )}
        </>
      )}
    </AuthContainer>
  );
};

export default RegisterTeacher;
