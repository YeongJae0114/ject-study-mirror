import { UserRound } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatChatTime";
import type { ChatRoomListItem } from "@/types/chat";

interface ChatListItemProps {
  room: ChatRoomListItem;
  onClick: () => void;
}

export default function ChatListItem({ room, onClick }: ChatListItemProps) {
  const { context, counterparty, lastMessage, unreadCount, lastMessageAt } =
    room;
  const relativeTime = formatRelativeTime(lastMessageAt);

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-primary-darker"
      >
        {/* 아바타: profileImage 없으면 placeholder (시안 갭) */}
        {counterparty.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={counterparty.profileImage}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full border border-border-primary object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-primary bg-bg-primary-darker text-text-disabled"
          >
            <UserRound size={24} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* 작품/공간 이름 */}
          <div className="truncate text-body-1 font-semibold text-text-primary">
            {context.title ?? "대화 중인 작품/공간"}
          </div>

          {/* 닉네임 · 시각 (2px 점 구분) */}
          <div className="flex items-center gap-1 text-label font-regular text-text-secondary">
            <span className="truncate">{counterparty.nickname ?? "상대방"}</span>
            {relativeTime && (
              <>
                <span
                  aria-hidden
                  className="size-0.5 shrink-0 rounded-full bg-text-secondary"
                />
                <span className="shrink-0">{relativeTime}</span>
              </>
            )}
          </div>

          {/* 마지막 메시지 + 안읽음 배지 (양 끝 정렬) */}
          {(lastMessage || unreadCount > 0) && (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 truncate text-label font-regular text-text-secondary">
                {lastMessage ?? ""}
              </div>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-object-red px-1.5 text-caption font-regular text-text-invert">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </div>
      </button>
    </li>
  );
}
