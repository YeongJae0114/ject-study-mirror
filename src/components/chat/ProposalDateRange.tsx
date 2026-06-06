"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

interface ProposalDateRangeProps {
  startDate?: Date;
  endDate?: Date;
  onChangeStart: (date: Date | undefined) => void;
  onChangeEnd: (date: Date | undefined) => void;
}

// 바텀시트 안에서 캘린더가 화면 밖으로 잘리지 않도록 중앙 모달로 띄운다.
export default function ProposalDateRange({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: ProposalDateRangeProps) {
  const [editing, setEditing] = useState<null | "start" | "end">(null);

  const close = () => setEditing(null);

  const handleSelect = (date: Date | undefined) => {
    if (editing === "start") onChangeStart(date);
    else if (editing === "end") onChangeEnd(date);
    close();
  };

  const selected = editing === "start" ? startDate : editing === "end" ? endDate : undefined;
  // 종료일은 시작일 이전 비활성, 시작일은 종료일 이후 비활성
  const disabled =
    editing === "end" && startDate
      ? { before: startDate }
      : editing === "start" && endDate
        ? { after: endDate }
        : undefined;

  return (
    <>
      <div className="flex items-center gap-2">
        <DateField value={startDate} onClick={() => setEditing("start")} />
        <span className="text-body-1 text-text-secondary">~</span>
        <DateField value={endDate} onClick={() => setEditing("end")} />
      </div>

      {editing !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-6"
          onClick={close}
        >
          <div
            className="rounded-2xl bg-white p-3 shadow-lg"
            onClick={event => event.stopPropagation()}
          >
            <DayPicker
              mode="single"
              selected={selected}
              defaultMonth={selected ?? startDate}
              disabled={disabled}
              locale={ko}
              onSelect={handleSelect}
              classNames={{
                button_previous: "[&_svg]:!fill-text-input",
                button_next: "[&_svg]:!fill-text-input",
                selected: "bg-object-primary-light font-semibold rounded-4xl",
                today: "font-bold",
                caption_label: "p-2.5",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function DateField({ value, onClick }: { value?: Date; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-primary flex h-12.5 flex-1 items-center justify-between rounded-lg border px-4 text-left"
    >
      <span className={`text-body-1 ${value ? "text-text-primary" : "text-text-input"}`}>
        {value ? format(value, "yyyy.MM.dd") : "YYYY.MM.DD"}
      </span>
      <CalendarDays size={20} className="text-text-secondary" />
    </button>
  );
}
