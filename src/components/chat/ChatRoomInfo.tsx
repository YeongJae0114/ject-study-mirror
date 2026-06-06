"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import ProposeExhibitionSheet from "@/components/chat/ProposeExhibitionSheet";
import { CHAT_CONTEXT_TYPE_LABEL, CHAT_PROPOSE_EXHIBITION_LABEL } from "@/constants/chat";
import type { ChatContext } from "@/types/chat";

interface ChatRoomInfoProps {
  context: ChatContext;
}

export default function ChatRoomInfo({ context }: ChatRoomInfoProps) {
  const [proposeOpen, setProposeOpen] = useState(false);

  return (
    <div className="border-b-border-primary bg-bg-primary flex w-full items-center gap-3 border-b px-4 py-3">
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
          className="bg-bg-primary-darker text-text-disabled flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
        >
          <ImageIcon size={24} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="text-body-1 text-text-primary truncate font-semibold">
          {context.title ?? "작품/공간"}
        </div>
        <div className="text-label font-regular text-text-secondary truncate">
          {CHAT_CONTEXT_TYPE_LABEL[context.type]}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setProposeOpen(true)}
        className="bg-object-primary text-label text-text-invert hover:bg-object-primary-hover active:bg-object-primary-pressed shrink-0 rounded-lg px-4 py-2 font-semibold transition-colors"
      >
        {CHAT_PROPOSE_EXHIBITION_LABEL}
      </button>

      <ProposeExhibitionSheet
        open={proposeOpen}
        onOpenChange={setProposeOpen}
        contextType={context.type}
        onSubmit={() => {
          // TODO: 백엔드 전시 제안 API 연동 후 제안 내용 채팅 전송
        }}
      />
    </div>
  );
}
