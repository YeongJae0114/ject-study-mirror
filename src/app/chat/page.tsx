"use client";

import { useRouter } from "next/navigation";

import ChatListItem from "@/components/chat/ChatListItem";
import EmptyChat from "@/components/chat/EmptyChat";
import { CHAT_LIST_TITLE, CHAT_LOADING_MESSAGE } from "@/constants/chat";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "채팅 목록을 불러오지 못했습니다.";
}

export default function ChatListPage() {
  const router = useRouter();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetchChatRooms = isAuthReady && isAuthenticated;
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useChatRooms(undefined, canFetchChatRooms);

  const rooms = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div className="bg-bg-primary flex min-h-screen flex-col">
      <header className="border-border-primary bg-bg-primary sticky top-0 z-10 flex h-14 items-center border-b px-5">
        <h1 className="text-headline-1 text-text-primary font-semibold">{CHAT_LIST_TITLE}</h1>
      </header>

      {!canFetchChatRooms || isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-body-1 text-text-secondary">{CHAT_LOADING_MESSAGE}</div>
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
          <p className="text-body-1 text-text-primary font-medium">{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="border-border-primary text-body-2 text-text-primary h-9 rounded-lg border px-4 font-medium"
          >
            다시 불러오기
          </button>
        </div>
      ) : rooms.length === 0 ? (
        <EmptyChat />
      ) : (
        <div className="pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <ul className="divide-border-primary flex flex-col divide-y">
            {rooms.map(room => (
              <ChatListItem
                key={room.id}
                room={room}
                onClick={() => router.push(`/chat/${room.id}`)}
              />
            ))}
          </ul>

          {hasNextPage && (
            <div className="flex justify-center py-4">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-label text-text-secondary rounded-lg px-4 py-2 font-medium disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
