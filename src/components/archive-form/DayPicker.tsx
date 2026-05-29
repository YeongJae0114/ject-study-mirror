"use client";

import { useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";

interface Props {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export default function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          readOnly
          value={value ? format(value, "yyyy.MM.dd") : ""}
          placeholder="YYYY.MM.DD"
          className="border-border-primary focus-within:border-border-secondary h-12.5 w-full rounded-lg border px-4 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <CalendarDays size={20} />
        </button>
      </div>

      {open && (
        <div className="border-border-primary absolute right-0 z-50 mt-2 rounded-2xl border bg-white p-3">
          <DayPicker
            mode="single"
            classNames={{
              button_previous: "[&_svg]:!fill-text-input",
              button_next: "[&_svg]:!fill-text-input",
              selected: "bg-object-primary-light font-semibold rounded-4xl",
              today: "font-bold",
              caption_label: "p-2.5",
            }}
            selected={value}
            locale={ko}
            onSelect={date => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
