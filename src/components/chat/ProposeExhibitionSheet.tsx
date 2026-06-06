"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Drawer } from "vaul";

import Dropdown from "@/components/archive-form/Dropdown";
import Input from "@/components/archive-form/Input";
import Label from "@/components/archive-form/Label";
import ProposalDateRange from "@/components/chat/ProposalDateRange";
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
  targetLabel?: string;
  targetPlaceholder?: string;
  targetMessage?: string;
  targetOptions?: { label: string; value: string; description?: string }[];
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: (draft: ProposeExhibitionDraft) => Promise<void> | void;
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export default function ProposeExhibitionSheet({
  open,
  onOpenChange,
  contextType,
  targetLabel,
  targetPlaceholder,
  targetMessage,
  targetOptions = [],
  isSubmitting = false,
  submitError = null,
  onSubmit,
}: ProposeExhibitionSheetProps) {
  const targetConfig = PROPOSE_EXHIBITION_TARGET[contextType];

  const [targetId, setTargetId] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const reset = () => {
    setTargetId("");
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const titleValid = title.trim().length > 0 && title.length <= PROPOSE_EXHIBITION_NAME_MAX_LENGTH;
  const dateError = Boolean(startDate && endDate && endDate < startDate);
  // 상단 내용 모두 입력 시 완료 버튼 활성화
  const isComplete =
    Boolean(targetId) &&
    titleValid &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    !dateError &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!isComplete || !startDate || !endDate) return;

    try {
      await onSubmit?.({
        targetId: Number(targetId),
        title: title.trim(),
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });
      onOpenChange(false);
    } catch {
      // submitError prop으로 실패 메시지를 표시한다.
    }
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
              <Label required>{targetLabel ?? targetConfig.label}</Label>
              <Dropdown
                required
                placeholder={targetPlaceholder ?? targetConfig.placeholder}
                options={targetOptions}
                value={targetId}
                onChange={setTargetId}
              />
              {targetMessage && (
                <div className="text-caption text-text-secondary">{targetMessage}</div>
              )}
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
              <ProposalDateRange
                startDate={startDate}
                endDate={endDate}
                onChangeStart={setStartDate}
                onChangeEnd={setEndDate}
              />
              {dateError && (
                <div className="text-caption text-error-default">
                  종료일은 시작일 이후로 선택해주세요.
                </div>
              )}
            </FieldWrapper>
          </div>

          {submitError && <div className="text-caption text-error-default pt-4">{submitError}</div>}

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
            {isSubmitting ? "전송 중" : PROPOSE_EXHIBITION_SUBMIT_LABEL}
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
