/**
 * 채팅 STOMP 소켓 레이어(순수 WebSocket, React Query와 별도).
 * prefix는 Spring 기본이 아닌 `/sub`(구독)·`/pub`(발행). 메시지 최대 2000자.
 * 인증: CONNECT 프레임 native 헤더 `Authorization: Bearer <token>`.
 */

import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { Message, SocketErrorPayload } from '@/types/chat';
import { getAccessToken, getMyUserId } from '@/services/session';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? '';

export interface ChatSocketHandlers {
  /** 방 메시지 수신 콜백. */
  onMessage: (message: Message) => void;
  /** errors 큐 통지 콜백(토스트 등). */
  onSocketError?: (payload: SocketErrorPayload) => void;
  /** STOMP 프로토콜 레벨 에러(연결 거부 등) 콜백. */
  onStompError?: (frame: { headers: Record<string, string>; body: string }) => void;
  /** 연결 수립 직후(onConnect) 콜백. */
  onConnected?: () => void;
  /** 연결 종료(onDisconnect/onWebSocketClose) 콜백. */
  onDisconnected?: () => void;
}

/** 채팅방 소켓 연결을 생성·활성화하고, dispose() 가능한 핸들을 반환한다. */
export function connectChatRoom(
  roomId: number,
  handlers: ChatSocketHandlers,
): ChatRoomSocket {
  const token = getAccessToken();
  const myUserId = getMyUserId();

  const client = new Client({
    brokerURL: WS_URL,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
  });

  let roomSub: StompSubscription | null = null;
  let errorSub: StompSubscription | null = null;

  client.onConnect = () => {
    roomSub = client.subscribe(`/sub/chat-rooms/${roomId}`, (frame: IMessage) => {
      handlers.onMessage(JSON.parse(frame.body) as Message);
    });

    // 개인 큐는 본인 것만 구독 가능(남의 id 구독은 WEBSOCKET_SUBSCRIBE_FORBIDDEN).
    if (myUserId !== null) {
      errorSub = client.subscribe(
        `/sub/users/${myUserId}/errors`,
        (frame: IMessage) => {
          handlers.onSocketError?.(JSON.parse(frame.body) as SocketErrorPayload);
        },
      );
    }

    handlers.onConnected?.();
  };

  client.onWebSocketClose = () => {
    handlers.onDisconnected?.();
  };

  if (handlers.onStompError) {
    client.onStompError = (frame) => {
      handlers.onStompError?.({
        headers: frame.headers as Record<string, string>,
        body: frame.body,
      });
    };
  }

  client.activate();

  return {
    /** 메시지 전송. stompjs v7은 미연결 시 publish()가 동기 throw하므로 연결 확인 후 호출. */
    sendMessage(content: string) {
      client.publish({
        destination: `/pub/chat-rooms/${roomId}/send`,
        body: JSON.stringify({ content }),
      });
    },
    /** 읽음 처리. body 없음. DB만 갱신(상대에게 실시간 푸시 없음). */
    markAsRead() {
      client.publish({
        destination: `/pub/chat-rooms/${roomId}/read`,
        body: '',
      });
    },
    /** 구독 해제 + 연결 종료. 언마운트 시 반드시 호출. */
    async dispose() {
      try {
        roomSub?.unsubscribe();
        errorSub?.unsubscribe();
      } catch {
        // 이미 연결이 끊겼으면 무시.
      }
      await client.deactivate();
    },
  };
}

export interface ChatRoomSocket {
  sendMessage: (content: string) => void;
  markAsRead: () => void;
  dispose: () => Promise<void>;
}
