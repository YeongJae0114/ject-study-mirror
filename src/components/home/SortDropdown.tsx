"use client";

import { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

const options = [
  { label: "최신순", value: "latest" },
  { label: "조회순", value: "views" },
];

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="text-label text-text-secondary flex items-center gap-0.5 font-medium"
      >
        {selected.label}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="bg-text-invert absolute top-full right-0 z-10 mt-2 w-24 rounded-lg py-1 shadow-lg">
          {options.map(option => {
            const isSelected = selected.value === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className={`text-label flex w-full items-center justify-between px-4 py-2 text-left font-medium ${
                  isSelected ? "text-text-primary-brand" : "text-text-primary"
                }`}
              >
                {option.label}

                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
