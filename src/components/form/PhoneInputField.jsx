import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

const PhoneInputField = ({
  name,
  label,
  placeholder,
  disabled = false,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium inline-block">
          {label}
        </label>
      )}

      <div dir="ltr">
        <PhoneInput
          id={name}
          international
          defaultCountry="EG"
          countryCallingCodeEditable={false}
          value={value}
          // onChange={onChange}
          onChange={(val) => onChange(val ?? "")}
          disabled={disabled}
          placeholder={placeholder}
          className={cn("phone-input-wrapper", error && "aria-invalid")}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneInputField;
