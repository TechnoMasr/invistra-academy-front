const StepProgress = ({ steps, currentStep, onStepClick }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute top-1/2 inset-s-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />

        {/* Active Line */}
        <div
          className="absolute top-1/2 inset-s-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />

        {steps.map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const isClickable = step <= currentStep;

          return (
            <button
              key={step}
              onClick={() => isClickable && onStepClick(step)}
              className={`
                z-10 flex items-center justify-center
                w-8 h-8
                rounded-full border-2 font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? "bg-secondary text-white border-secondary scale-110 shadow-md"
                    : isCompleted
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-400 border-gray-300"
                }
                ${
                  isClickable
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-not-allowed"
                }
              `}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
