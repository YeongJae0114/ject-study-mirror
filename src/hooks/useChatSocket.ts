/**
 * 채팅방 실시간 소켓 훅. STOMP 수신 메시지를 useMessages와 같은 캐시에 머지.
 * 응답이 DESC이므로 새 메시지는 첫 페이지 맨 앞에 prepend, 서버 에코분은 id로 dedupe.
 */

import { useEffect, useRef, useState } from "react";

import { useQueryClient, type InfiniteData, type QueryClient } from "@tanstack/react-query";

import { messagesKey } from "@/hooks/useMessages";
import { connectChatRoom, type ChatRoomSocket } from "@/services/chatSocket";
import { useSession } from "@/services/session";
import type { CursorPage, Message, SocketErrorPayload } from "@/types/chat";

/** 수신 메시지를 캐시에 머지. 첫 페이지 앞에 prepend, 전 페이지 통틀어 id 중복 제거. */
function mergeIncomingMessage(queryClient: QueryClient, roomId: number, message: Message) {
  queryClient.setQueryData<InfiniteData<CursorPage<Message>>>(messagesKey(roomId), prev => {
    // 이력 없으면 단일 페이지로 시드.
    if (!prev || prev.pages.length === 0) {
      return {
        pages: [{ items: [message], nextCursor: null, hasNext: false }],
        pageParams: [undefined],
      };
    }

    const exists = prev.pages.some(page => page.items.some(m => m.id === message.id));
    if (exists) return prev;

    const [firstPage, ...restPages] = prev.pages;
    const updatedFirst: CursorPage<Message> = {
      ...firstPage,
      items: [message, ...firstPage.items],
    };
    return { ...prev, pages: [updatedFirst, ...restPages] };
  });
}

export interface UseChatSocketResult {
  /** 연결 여부(구독 활성 추정용). */
  isConnected: boolean;
  /** 마지막 errors 큐 통지(토스트 표시용). */
  lastError: SocketErrorPayload | null;
  /** 메시지 전송(소켓 publish). */
  sendMessage: (content: string) => void;
  /** 읽음 처리 publish. */
  markAsRead: () => void;
}

export function useChatSocket(roomId: number, enabled = true): UseChatSocketResult {
  const queryClient = useQueryClient();
  const { accessToken, myUserId } = useSession();
  const socketRef = useRef<ChatRoomSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<SocketErrorPayload | null>(null);

  useEffect(() => {
    // 토큰/유저 없으면 연결하지 않는다(WEBSOCKET_UNAUTHORIZED 방지).
    if (!enabled || !accessToken || myUserId === null || !Number.isFinite(roomId)) {
      return;
    }

    // 언마운트 후 비동기 콜백이 setState 하지 않도록 가드.
    let active = true;

    const socket = connectChatRoom(roomId, {
      onMessage: message => mergeIncomingMessage(queryClient, roomId, message),
      onSocketError: payload => {
        if (active) setLastError(payload);
      },
      onConnected: () => {
        if (active) setIsConnected(true);
      },
      onDisconnected: () => {
        if (active) setIsConnected(false);
      },
      onStompError: () => {
        if (active) setIsConnected(false);
      },
    });
    socketRef.current = socket;

    return () => {
      active = false;
      socketRef.current = null;
      setIsConnected(false);
      void socket.dispose();
    };
    // roomId/인증이 바뀌면 재연결. queryClient는 안정적.
  }, [roomId, enabled, accessToken, myUserId, queryClient]);

  return {
    isConnected,
    lastError,
    // 미연결 시 stompjs v7 publish()가 동기 throw하므로 isConnected 가드 + try/catch(끊김 레이스 대비).
    sendMessage: (content: string) => {
      if (!isConnected) return;
      try {
        socketRef.current?.sendMessage(content);
      } catch {
        // publish 실패 무시(상위에서 isConnected로 피드백).
      }
    },
    markAsRead: () => {
      if (!isConnected) return;
      try {
        socketRef.current?.markAsRead();
      } catch {
        // 미연결 publish throw 방지.
      }
    },
  };
}
