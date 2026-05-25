"use client";

import { AlertCircle } from "lucide-react";
import { type ChangeEvent, type InputHTMLAttributes } from "react";
import Label from "./Label";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  message?: string;
  deleteButton?: boolean;
  onlyNumber?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({
  label,
  required = false,
  message,
  placeholder,
  deleteButton = false,
  maxLength,
  onlyNumber = false,
  value,
  onChange,
}: InputProps) {
  const writing = value.length > 0;
  const isError = maxLength !== undefined && value.length > maxLength;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let currentValue = e.target.value;

    if (onlyNumber) {
      currentValue = currentValue.replace(/[^0-9]/g, "");
    }

    onChange(currentValue);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Input Wrapper */}
      <div
        className={`
          flex h-12.5 w-full items-center
          rounded-lg border bg-white px-4 transition-colors
          ${
            isError
              ? "border-error-default"
              : "border-border-primary focus-within:border-border-secondary"
          }
        `}
      >
        {/* Label */}
        {label && <Label required={required}>{label}</Label>}
        <input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="
            flex-1 bg-transparent
            text-body-1 text-coolNeutral-900
            outline-none
            placeholder:text-text-input
          "
        />

        {isError && (
          <div>
            <AlertCircle size={24} className="fill-red-500 text-white" />
          </div>
        )}

        {deleteButton && !isError && writing && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center"
          >
            <img src="/cancel-icon.svg" alt="취소" className="w-6 h-6" />
          </button>
        )}
      </div>

      {isError ? (
        <p className="text-caption text-error-default">
          작품명은 최대 {maxLength}자까지 작성해주세요.
        </p>
      ) : (
        message && <p className="text-body-2 text-coolNeutral-700">{message}</p>
      )}
    </div>
  );
}
