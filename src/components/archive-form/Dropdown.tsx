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
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  label,
  required = false,
  message,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex w-full flex-col gap-3">
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="border-border-primary flex h-12.5 w-full items-center justify-between rounded-lg border bg-white px-4 transition-colors"
      >
        <span
          className={`text-body-1 ${value ? "text-text-primary medium" : "text-text-input regular"}`}
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={20}
          className={`text-coolNeutral-700 transition-transform ${isOpen ? "rotate-180" : ""} `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="border-border-primary absolute top-13.5 z-20 w-full rounded-xl border bg-white p-3">
          {options.map(option => {
            const isSelected = value === option.label;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                className={`flex w-full flex-col rounded-lg px-3 py-3 text-left transition-colors ${
                  isSelected ? "bg-object-primary-light" : "hover:bg-bg-primary-darker"
                } `}
              >
                <span
                  className={`text-body-1 font-medium ${
                    isSelected
                      ? "text-text-primary-brand font-semibold"
                      : "text-text-secondary font-medium"
                  } `}
                >
                  {option.label}
                </span>
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
