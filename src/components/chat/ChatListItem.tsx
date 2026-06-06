import { UserRound } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatChatTime";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import type { ChatRoomListItem } from "@/types/chat";

interface ChatListItemProps {
  room: ChatRoomListItem;
  onClick: () => void;
}

export default function ChatListItem({ room, onClick }: ChatListItemProps) {
  const { context, counterparty, lastMessage, unreadCount, lastMessageAt } = room;
  const relativeTime = formatRelativeTime(lastMessageAt);
  const profileImageUrl = normalizeImageUrl(counterparty.profileImage);

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="hover:bg-bg-primary-darker flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
      >
        {/* 아바타: profileImage 없으면 placeholder (시안 갭) */}
        {profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImageUrl}
            alt=""
            className="border-border-primary h-12 w-12 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="border-border-primary bg-bg-primary-darker text-text-disabled flex h-12 w-12 shrink-0 items-center justify-center rounded-full border"
          >
            <UserRound size={24} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* 작품/공간 이름 */}
          <div className="text-body-1 text-text-primary truncate font-semibold">
            {context.title ?? "대화 중인 작품/공간"}
          </div>

          {/* 닉네임 · 시각 (2px 점 구분) */}
          <div className="text-label font-regular text-text-secondary flex items-center gap-1">
            <span className="truncate">{counterparty.nickname ?? "상대방"}</span>
            {relativeTime && (
              <>
                <span aria-hidden className="bg-text-secondary size-0.5 shrink-0 rounded-full" />
                <span className="shrink-0">{relativeTime}</span>
              </>
            )}
          </div>

          {/* 마지막 메시지 + 안읽음 배지 (양 끝 정렬) */}
          {(lastMessage || unreadCount > 0) && (
            <div className="flex items-center justify-between gap-2">
              <div className="text-label font-regular text-text-secondary min-w-0 flex-1 truncate">
                {lastMessage ?? ""}
              </div>
              {unreadCount > 0 && (
                <span className="bg-object-red text-caption font-regular text-text-invert flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5">
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
