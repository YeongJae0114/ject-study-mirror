"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Drawer } from "vaul";

import DatePicker from "@/components/archive-form/DayPicker";
import Dropdown from "@/components/archive-form/Dropdown";
import Input from "@/components/archive-form/Input";
import Label from "@/components/archive-form/Label";
import {
  PROPOSE_EXHIBITION_NAME_LABEL,
  PROPOSE_EXHIBITION_NAME_MAX_LENGTH,
  PROPOSE_EXHIBITION_NAME_PLACEHOLDER,
  PROPOSE_EXHIBITION_SCHEDULE_LABEL,
  PROPOSE_EXHIBITION_SUBMIT_LABEL,
  PROPOSE_EXHIBITION_SUBTITLE,
  PROPOSE_EXHIBITION_TARGET,
  PROPOSE_EXHIBITION_TITLE,
} from "@/constants/chat";
import type { ChatContextType, ProposeExhibitionDraft } from "@/types/chat";

interface ProposeExhibitionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contextType: ChatContextType;
  /** 희망 전시 작품/공간 후보. 추후 내 작품·공간 목록 API 연동(현재는 빈 배열). */
  targetOptions?: { label: string }[];
  /** 완료 시 호출. 미지정이면 닫기만(전송은 백엔드 연동 후). */
  onSubmit?: (draft: ProposeExhibitionDraft) => void;
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export default function ProposeExhibitionSheet({
  open,
  onOpenChange,
  contextType,
  targetOptions = [],
  onSubmit,
}: ProposeExhibitionSheetProps) {
  const targetConfig = PROPOSE_EXHIBITION_TARGET[contextType];

  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const reset = () => {
    setTarget("");
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const titleValid = title.trim().length > 0 && title.length <= PROPOSE_EXHIBITION_NAME_MAX_LENGTH;
  const dateError = Boolean(startDate && endDate && endDate < startDate);
  // 상단 내용 모두 입력 시 완료 버튼 활성화
  const isComplete =
    Boolean(target) && titleValid && Boolean(startDate) && Boolean(endDate) && !dateError;

  const handleSubmit = () => {
    if (!isComplete || !startDate || !endDate) return;

    onSubmit?.({
      target,
      title: title.trim(),
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    onOpenChange(false);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />

        <Drawer.Content className="bg-bg-primary fixed right-0 bottom-0 left-0 z-50 mx-auto flex w-full flex-col rounded-t-3xl px-5 pt-3 pb-9 outline-none">
          {/* Handle */}
          <div className="flex justify-center">
            <div className="h-1.25 w-9 rounded-full bg-black" />
          </div>

          {/* Header */}
          <Drawer.Title className="text-heading-2 text-text-primary pt-5 font-semibold">
            {PROPOSE_EXHIBITION_TITLE}
          </Drawer.Title>
          <Drawer.Description className="text-body-1 text-text-secondary pt-1">
            {PROPOSE_EXHIBITION_SUBTITLE}
          </Drawer.Description>

          {/* Form */}
          <div className="flex flex-col gap-6 pt-6">
            {/* 희망 전시 작품/공간 */}
            <FieldWrapper>
              <Label required>{targetConfig.label}</Label>
              <Dropdown
                required
                placeholder={targetConfig.placeholder}
                options={targetOptions}
                value={target}
                onChange={setTarget}
              />
            </FieldWrapper>

            {/* 전시 이름 */}
            <FieldWrapper>
              <Label required>{PROPOSE_EXHIBITION_NAME_LABEL}</Label>
              <Input
                required
                placeholder={PROPOSE_EXHIBITION_NAME_PLACEHOLDER}
                deleteButton
                maxLength={PROPOSE_EXHIBITION_NAME_MAX_LENGTH}
                value={title}
                onChange={setTitle}
              />
            </FieldWrapper>

            {/* 희망 전시 일정 */}
            <FieldWrapper>
              <Label required>{PROPOSE_EXHIBITION_SCHEDULE_LABEL}</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DatePicker value={startDate} onChange={setStartDate} />
                </div>
                <span className="text-body-1 text-text-secondary">~</span>
                <div className="flex-1">
                  <DatePicker value={endDate} onChange={setEndDate} />
                </div>
              </div>
              {dateError && (
                <p className="text-caption text-error-default">
                  종료일은 시작일 이후로 선택해주세요.
                </p>
              )}
            </FieldWrapper>
          </div>

          {/* 완료 */}
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleSubmit}
            className={`text-body-1 mt-8 h-12.5 w-full rounded-lg font-semibold transition-colors ${
              isComplete
                ? "bg-bg-secondary text-text-invert"
                : "bg-object-disabled text-text-disabled"
            } `}
          >
            {PROPOSE_EXHIBITION_SUBMIT_LABEL}
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
