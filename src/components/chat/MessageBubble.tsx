import { UserRound } from "lucide-react";

import type { Message } from "@/types/chat";
import { formatMessageTime } from "@/utils/formatChatTime";

interface MessageBubbleProps {
  message: Message;
  /** senderId === myUserId 로 부모가 계산해서 전달 */
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = formatMessageTime(message.createdAt);

  if (isOwn) {
    return (
      <div className="flex items-end justify-end gap-2">
        {time && <span className="text-caption font-regular text-text-secondary">{time}</span>}
        <div className="bg-object-chat-out text-body-1 text-text-primary max-w-[250px] rounded-lg px-4 py-2 break-words whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-start gap-2">
      {/* 기본 아바타 (profileImage 미구현 → placeholder) */}
      <div
        aria-hidden
        className="bg-bg-primary-darker text-text-disabled flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      >
        <UserRound size={20} />
      </div>
      <div className="border-border-chat bg-bg-primary text-body-1 text-text-primary max-w-[196px] rounded-lg border px-4 py-2 break-words whitespace-pre-wrap">
        {message.content}
      </div>
      {time && <span className="text-caption font-regular text-text-secondary">{time}</span>}
    </div>
  );
}
