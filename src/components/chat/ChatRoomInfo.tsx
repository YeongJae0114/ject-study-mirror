import { ImageIcon } from "lucide-react";
import {
  CHAT_CONTEXT_TYPE_LABEL,
  CHAT_PROPOSE_EXHIBITION_LABEL,
} from "@/constants/chat";
import type { ChatContext } from "@/types/chat";

interface ChatRoomInfoProps {
  context: ChatContext;
}

export default function ChatRoomInfo({ context }: ChatRoomInfoProps) {
  // TODO: 전시 제안하기 동작 연결 (현재 UI만)
  const handleProposeExhibition = () => {};

  return (
    <div className="flex w-full items-center gap-3 border-b border-b-border-primary bg-bg-primary px-4 py-3">
      {/* 썸네일 (없으면 placeholder) */}
      {context.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={context.thumbnailUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-primary-darker text-text-disabled"
        >
          <ImageIcon size={24} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-body-1 font-semibold text-text-primary">
          {context.title ?? "작품/공간"}
        </div>
        <div className="truncate text-label font-regular text-text-secondary">
          {CHAT_CONTEXT_TYPE_LABEL[context.type]}
        </div>
      </div>

      <button
        type="button"
        onClick={handleProposeExhibition}
        className="shrink-0 rounded-lg bg-object-primary px-4 py-2 text-label font-semibold text-text-invert transition-colors hover:bg-object-primary-hover active:bg-object-primary-pressed"
      >
        {CHAT_PROPOSE_EXHIBITION_LABEL}
      </button>
    </div>
  );
}
