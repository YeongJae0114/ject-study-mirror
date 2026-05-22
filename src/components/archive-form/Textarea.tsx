"use client";

import { useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";

import Label from "./Label";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  maxLength?: number;
  includeCountArea?: boolean;
  scrollable?: boolean;
}

export default function TextArea({
  label,
  required = false,
  message,
  placeholder,
  maxLength = 500,
  includeCountArea = true,
  scrollable = false,
  ...props
}: TextAreaProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}

      {/* Textarea */}
      <div
        className={`
          w-full rounded-lg border bg-white
          flex flex-col
          transition-colors
          ${focused ? "border-border-secondary" : "border-border-primary"}
        `}
      >
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="
            w-full bg-transparent px-4 pt-3 pb-2
            text-body-1 text-coolNeutral-900
            outline-none
            placeholder:text-text-input
            resize-none
            h-31 overflow-y-auto
          "
          {...props}
        />

        {/* Count */}
        {includeCountArea && (
          <div className="px-4 pt-1.5 pb-2 flex justify-end">
            <span className="text-caption text-coolNeutral-600">
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Message */}
      {message && <p className="text-body-2 text-coolNeutral-700">{message}</p>}
    </div>
  );
}
