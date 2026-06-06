"use client";

import { type ChangeEvent, type FormEvent } from "react";

import { ArrowRight } from "lucide-react";

import { CHAT_INPUT_PLACEHOLDER, CHAT_MESSAGE_MAX_LENGTH } from "@/constants/chat";
import { useChatStore } from "@/stores/useChatStore";

interface ChatInputProps {
  /** 트림된 내용 전달. 부모가 소켓 sendMessage 연결 */
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const draftMessage = useChatStore(state => state.draftMessage);
  const setDraftMessage = useChatStore(state => state.setDraftMessage);

  const trimmed = draftMessage.trim();
  const canSend = trimmed.length > 0 && !disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(e.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(trimmed);
    setDraftMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-primary flex w-full items-center gap-2 px-4 py-3"
    >
      <div className="border-border-primary bg-bg-primary focus-within:border-border-secondary flex flex-1 items-center rounded-lg border px-4 py-2 transition-colors">
        <input
          value={draftMessage}
          onChange={handleChange}
          placeholder={CHAT_INPUT_PLACEHOLDER}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          disabled={disabled}
          className="text-body-1 text-text-primary placeholder:text-text-input flex-1 bg-transparent outline-none"
        />
      </div>

      <button
        type="submit"
        aria-label="메시지 전송"
        disabled={!canSend}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          canSend
            ? "bg-object-primary text-text-invert hover:bg-object-primary-hover active:bg-object-primary-pressed"
            : "bg-object-disabled text-text-disabled cursor-not-allowed"
        }`}
      >
        <ArrowRight size={20} />
      </button>
    </form>
  );
}
