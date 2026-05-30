import { UserRound } from "lucide-react";
import { formatMessageTime } from "@/utils/formatChatTime";
import type { Message } from "@/types/chat";

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
        {time && (
          <span className="text-caption font-regular text-text-secondary">
            {time}
          </span>
        )}
        <div className="max-w-[250px] rounded-lg bg-object-chat-out px-4 py-2 text-body-1 text-text-primary break-words whitespace-pre-wrap">
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
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-primary-darker text-text-disabled"
      >
        <UserRound size={20} />
      </div>
      <div className="max-w-[196px] rounded-lg border border-border-chat bg-bg-primary px-4 py-2 text-body-1 text-text-primary break-words whitespace-pre-wrap">
        {message.content}
      </div>
      {time && (
        <span className="text-caption font-regular text-text-secondary">
          {time}
        </span>
      )}
    </div>
  );
}
