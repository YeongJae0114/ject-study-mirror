import React, { useId } from "react";

interface AuthTextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "textarea";
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  showClearButton?: boolean;
  status?: "default" | "error" | "success";
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function AuthTextField({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  disabled = false,
  required = false,
  showClearButton = false,
  status = "default",
  onFocus,
  onBlur,
}: AuthTextFieldProps) {
  const id = useId();
  const fieldStatus = error ? "error" : status;

  const borderClass = (() => {
    if (disabled) return "border-border-primary";
    if (fieldStatus === "error") return "border-border-error";
    if (fieldStatus === "success") return "border-border-secondary-focus";
    return "border-border-primary focus-within:border-border-secondary-focus";
  })();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="text-label text-text-primary mb-2 block font-medium">
          {label}
          {required && <span className="text-error-default ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <div
          className={[
            "bg-bg-primary relative w-full rounded-lg border transition-colors",
            "min-h-[150px] px-4 pt-3 pb-9",
            disabled ? "bg-object-disabled text-text-disabled" : "",
            borderClass,
          ].join(" ")}
        >
          <textarea
            id={id}
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            rows={5}
            className="text-body-1 font-regular text-text-primary placeholder:text-text-input disabled:text-text-disabled h-full min-h-[105px] w-full resize-none bg-transparent outline-none disabled:cursor-not-allowed"
          />

          {maxLength && (
            <p className="text-caption font-regular text-text-secondary absolute right-4 bottom-3">
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      ) : (
        <div
          className={[
            "bg-bg-primary relative flex h-[50px] w-full items-center rounded-lg border px-4 transition-colors",
            disabled ? "bg-object-disabled text-text-disabled" : "",
            borderClass,
          ].join(" ")}
        >
          <input
            id={id}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className="text-body-1 font-regular text-text-primary placeholder:text-text-input disabled:text-text-disabled h-full w-full bg-transparent outline-none disabled:cursor-not-allowed"
          />

          {showClearButton &&
            value &&
            !disabled &&
            fieldStatus !== "success" &&
            fieldStatus !== "error" && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-text-secondary text-text-invert ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                aria-label="입력값 지우기"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3L9 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 3L3 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}

          {fieldStatus === "error" && !disabled && (
            <div className="bg-error-default text-text-invert ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
              <span className="text-caption leading-none font-bold">!</span>
            </div>
          )}

          {fieldStatus === "success" && !disabled && (
            <div className="bg-object-primary text-text-invert ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6L5.2 8.2L9 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-caption font-regular text-error-default mt-2">{error}</p>}
    </div>
  );
}
