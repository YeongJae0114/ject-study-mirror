"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatRoomInfo from "@/components/chat/ChatRoomInfo";
import MessageList from "@/components/chat/MessageList";
import { useCreateChatRoom } from "@/hooks/useCreateChatRoom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useSendFirstMessage } from "@/hooks/useSendFirstMessage";
import { useSession } from "@/services/session";
import type { ChatContextType, CreateChatRoomResult } from "@/types/chat";

const VALID_TYPES: ChatContextType[] = ["ARTWORK", "SPACE"];

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * 방이 아직 없는 "대기" 채팅 화면.
 * 진입 시 POST /chat-rooms로 방을 조회/생성한다.
 *  - id 있음(기존 방 등) → /chat/{id}로 replace(종전 STOMP 흐름)
 *  - id null → 이 화면에서 대기. 첫 메시지는 REST(POST /chat-rooms/messages)로 보내며
 *    응답 chatRoomId로 실제 방(/chat/{chatRoomId})에 진입해 구독을 시작한다.
 */
function NewChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const targetType = VALID_TYPES.includes(typeParam as ChatContextType)
    ? (typeParam as ChatContextType)
    : null;
  const targetId = Number(searchParams.get("targetId"));
  const hasValidParams = targetType !== null && Number.isFinite(targetId);

  const { myUserId } = useSession();
  const { isAuthReady, isAuthenticated } = useRequireAuth();

  const createChatRoom = useCreateChatRoom();
  const sendFirstMessage = useSendFirstMessage();
  const [pendingRoom, setPendingRoom] = useState<CreateChatRoomResult | null>(null);
  const ensureStartedRef = useRef(false);

  // 진입 시 한 번만 방을 조회/생성한다.
  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || !hasValidParams) return;
    if (ensureStartedRef.current) return;
    ensureStartedRef.current = true;

    createChatRoom.mutate(
      { targetType, targetId },
      {
        onSuccess: room => {
          if (room.id !== null) {
            router.replace(`/chat/${room.id}`);
          } else {
            setPendingRoom(room);
          }
        },
      }
    );
  }, [isAuthReady, isAuthenticated, hasValidParams, targetType, targetId, createChatRoom, router]);

  // 상대 닉네임: 상세 응답엔 counterparty가 없어 artist/host 중 내가 아닌 쪽으로 계산.
  const counterpartyNickname =
    pendingRoom !== null
      ? (pendingRoom.artist.id === myUserId ? pendingRoom.host : pendingRoom.artist).nickname
      : null;

  const handleSendFirst = (content: string) => {
    if (!hasValidParams) return;

    sendFirstMessage.mutate(
      { targetType, targetId, content },
      {
        onSuccess: result => router.replace(`/chat/${result.chatRoomId}`),
      }
    );
  };

  if (!hasValidParams) {
    return (
      <div className="bg-bg-primary flex h-screen flex-col">
        <ChatHeader title={null} />
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <p className="text-body-1 text-text-primary font-medium">올바르지 않은 접근입니다.</p>
        </div>
      </div>
    );
  }

  // 방 조회/생성 중이거나 기존 방으로 이동 중.
  if (pendingRoom === null) {
    return (
      <div className="bg-bg-primary flex h-screen flex-col">
        <ChatHeader title={null} />
        {createChatRoom.isError ? (
          <div className="flex flex-1 items-center justify-center px-5 text-center">
            <p className="text-body-1 text-text-primary font-medium">
              {getErrorMessage(createChatRoom.error, "채팅방을 열 수 없습니다.")}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-body-1 text-text-secondary">불러오는 중...</div>
          </div>
        )}
      </div>
    );
  }

  const sendError = sendFirstMessage.isError
    ? getErrorMessage(sendFirstMessage.error, "메시지를 보내지 못했습니다.")
    : null;

  return (
    <div className="bg-bg-primary flex h-screen flex-col">
      <ChatHeader title={counterpartyNickname} />

      <ChatRoomInfo roomId={null} context={pendingRoom.context} />

      {sendError && (
        <div
          role="alert"
          className="bg-error-light text-label text-error-default px-4 py-2 font-medium"
        >
          {sendError}
        </div>
      )}

      <MessageList messages={[]} myUserId={myUserId} />

      <ChatInput onSend={handleSendFirst} disabled={sendFirstMessage.isPending} />
    </div>
  );
}

export default function NewChatPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-primary flex h-screen flex-col">
          <ChatHeader title={null} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-body-1 text-text-secondary">불러오는 중...</div>
          </div>
        </div>
      }
    >
      <NewChatContent />
    </Suspense>
  );
}
