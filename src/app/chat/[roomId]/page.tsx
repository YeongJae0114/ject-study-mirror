"use client";

import { use, useEffect, useMemo } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatRoomInfo from "@/components/chat/ChatRoomInfo";
import MessageList from "@/components/chat/MessageList";
import { useChatRoom } from "@/hooks/useChatRoom";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useMessages } from "@/hooks/useMessages";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useSession } from "@/services/session";

interface ChatRoomPageProps {
  // Next.js 16: params는 Promise
  params: Promise<{ roomId: string }>;
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = use(params);
  const id = Number(roomId);

  const { myUserId } = useSession();

  // 방 정보: 딥링크/새로고침 대비 상세 조회(useChatRoom) 우선, 없으면 방 목록 캐시 폴백.
  const { data: roomDetail } = useChatRoom(id);
  const { data: roomsData } = useChatRooms();
  const roomListItem = useMemo(
    () => roomsData?.pages.flatMap((page) => page.items).find((r) => r.id === id),
    [roomsData, id],
  );

  const roomContext = roomDetail?.context ?? roomListItem?.context ?? null;

  // 상대 닉네임: 상세엔 counterparty가 없어 artist/host 중 내가 아닌 쪽으로 계산, 목록은 counterparty 직접 사용.
  const counterpartyNickname = useMemo(() => {
    if (roomDetail) {
      const counterpart =
        roomDetail.artist.id === myUserId ? roomDetail.host : roomDetail.artist;
      return counterpart.nickname;
    }
    return roomListItem?.counterparty.nickname ?? null;
  }, [roomDetail, roomListItem, myUserId]);

  const {
    data: messagesData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessages(id);

  const { sendMessage, markAsRead, lastError, isConnected } = useChatSocket(id);

  const messages = useMemo(
    () => messagesData?.pages.flatMap((page) => page.items) ?? [],
    [messagesData],
  );

  // 읽음 처리는 연결 완료 후에만 발행(stompjs v7은 미연결 시 publish()가 동기 throw).
  useEffect(() => {
    if (isConnected) markAsRead();
    // markAsRead는 socketRef 기반으로 안정적이라 deps에서 제외.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isConnected]);

  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      <ChatHeader title={counterpartyNickname} />

      {roomContext && <ChatRoomInfo context={roomContext} />}

      {lastError && (
        <div
          role="alert"
          className="bg-error-light px-4 py-2 text-label font-medium text-error-default"
        >
          {lastError.error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-body-1 text-text-secondary">
            메시지를 불러오는 중...
          </div>
        </div>
      ) : (
        <MessageList
          messages={messages}
          myUserId={myUserId}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      )}

      <ChatInput onSend={sendMessage} disabled={!isConnected} />
    </div>
  );
}
