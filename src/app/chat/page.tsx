"use client";

import { useRouter } from "next/navigation";

import ChatListItem from "@/components/chat/ChatListItem";
import EmptyChat from "@/components/chat/EmptyChat";
import { CHAT_LIST_TITLE, CHAT_LOADING_MESSAGE } from "@/constants/chat";
import { useChatRooms } from "@/hooks/useChatRooms";

export default function ChatListPage() {
  const router = useRouter();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useChatRooms();

  const rooms = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div className="bg-bg-primary flex min-h-screen flex-col">
      <header className="border-border-primary bg-bg-primary sticky top-0 z-10 flex h-14 items-center border-b px-5">
        <h1 className="text-headline-1 text-text-primary font-semibold">{CHAT_LIST_TITLE}</h1>
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-body-1 text-text-secondary">{CHAT_LOADING_MESSAGE}</div>
        </div>
      ) : rooms.length === 0 ? (
        <EmptyChat />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
