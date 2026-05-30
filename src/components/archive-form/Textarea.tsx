"use client";

import { useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";

import Label from "./Label";
interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  maxLength?: number;
  includeCountArea?: boolean;
  scrollable?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function TextArea({
  label,
  required = false,
  message,
  placeholder,
  maxLength = 500,
  includeCountArea = true,
  scrollable = false,
  value,
  onChange,
  ...props
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const isError = value.length > maxLength;

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}

      {/* Textarea */}
      <div
        className={`flex w-full flex-col rounded-lg border bg-white transition-colors ${
          isError
            ? "border-error-default"
            : focused
              ? "border-border-secondary"
              : "border-border-primary"
        } `}
      >
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="text-body-1 text-coolNeutral-900 placeholder:text-text-input h-31 w-full resize-none overflow-y-auto bg-transparent px-4 pt-3 pb-2 outline-none"
          {...props}
        />

        {/* Count */}
        {includeCountArea && (
          <div className="flex justify-end px-4 pt-1.5 pb-2">
            <span className="text-caption text-coolNeutral-600">
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Message */}
      {message && <p className="text-body-2 text-coolNeutral-700">{message}</p>}

      {/* Error */}
      {isError && (
        <p className="text-caption font-regular text-error-default">
          최대 {maxLength}자까지 작성해주세요.
        </p>
      )}
    </div>
  );
}
