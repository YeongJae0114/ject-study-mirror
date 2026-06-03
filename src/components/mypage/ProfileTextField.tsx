import { useId } from "react";

import { X } from "lucide-react";

interface ProfileTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  type?: "text" | "textarea" | "url" | "email";
  onChange: (value: string) => void;
}

export default function ProfileTextField({
  label,
  value,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  maxLength,
  type = "text",
  onChange,
}: ProfileTextFieldProps) {
  const id = useId();
  const isTextarea = type === "textarea";
  const hasClearButton = !disabled && !isTextarea && value.length > 0;

  const borderClass = error
    ? "border-error-default"
    : "border-border-primary focus-within:border-border-secondary";

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-label text-text-primary flex gap-1 font-semibold">
        {label}
        {required && <span className="text-error-default">*</span>}
      </label>

      <div
        className={`bg-bg-primary relative w-full rounded-lg border transition-colors ${borderClass} ${
          disabled ? "bg-object-disabled" : ""
        } ${isTextarea ? "min-h-31" : "h-12.5"}`}
      >
        {isTextarea ? (
          <textarea
            id={id}
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className="text-body-1 text-text-primary placeholder:text-text-input disabled:text-text-disabled h-31 w-full resize-none overflow-y-auto bg-transparent px-4 pt-2 pr-4 pb-9 outline-none disabled:cursor-not-allowed"
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className="text-body-1 text-text-primary placeholder:text-text-input disabled:text-text-disabled h-full w-full min-w-0 bg-transparent px-4 pr-11 outline-none disabled:cursor-not-allowed"
          />
        )}

        {hasClearButton && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-text-secondary text-text-invert absolute top-1/2 right-4 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full"
            aria-label={`${label} 지우기`}
          >
            <X size={12} />
          </button>
        )}

        {isTextarea && maxLength && (
          <span className="text-caption text-text-secondary absolute right-4 bottom-2">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-caption text-error-default">{error}</p>
      ) : (
        description && <p className="text-caption text-text-secondary">{description}</p>
      )}
    </div>
  );
}
