"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Label from "./Label";

interface DropdownOption {
  label: string;
  description?: string;
}

interface DropdownProps {
  label?: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  options: DropdownOption[];
}

export default function Dropdown({
  label,
  required = false,
  message,
  placeholder,
  options,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");

  return (
    <div className="relative flex w-full flex-col gap-3">
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex h-12.5 w-full items-center justify-between
          rounded-lg border bg-white px-4
          transition-colors border-border-primary

        `}
      >
        <span
          className={`text-body-1 ${selectedValue ? "text-text-primary medium" : "text-text-input regular"}`}
        >
          {selectedValue || placeholder}
        </span>

        <ChevronDown
          size={20}
          className={`
            text-coolNeutral-700
            transition-transform
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute top-22 z-20 w-full
            rounded-xl border border-border-primary
            bg-white p-2
          "
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.label;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setSelectedValue(option.label);
                  setIsOpen(false);
                }}
                className={`
                  flex w-full flex-col
                  rounded-xl px-4 py-3 text-left
                  transition-colors
                  ${
                    isSelected
                      ? "bg-object-primary-light"
                      : "hover:bg-bg-primary-darker"
                  }
                `}
              >
                <span
                  className={`
                    text-body-1 font-medium
                    ${
                      isSelected
                        ? "text-text-primary-brand font-semibold"
                        : "text-text-secondary font-medium"
                    }
                  `}
                >
                  {option.label}
                </span>

                {option.description && (
                  <span
                    className="
                      mt-1 text-caption
                      text-coolNeutral-600
                    "
                  >
                    {option.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Message */}
      {message && <p className="text-body-2 text-coolNeutral-700">{message}</p>}
    </div>
  );
}
