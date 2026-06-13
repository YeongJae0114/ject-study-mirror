// 채팅 REST 데이터 레이어 (조회/생성만 REST, 메시지 전송은 STOMP publish — chatSocket.ts).
// 모든 응답은 apiClient에서 { data, meta } → .data로 언랩됨. 엔드포인트: api-spec.md §3.

import { apiClient } from "@/services/apiClient";
import type {
  ChatContextType,
  ChatRoom,
  ChatRoomListItem,
  CreateChatRoomBody,
  CreateChatRoomResult,
  CursorPage,
  Message,
  SendFirstMessageBody,
  SendFirstMessageResult,
} from "@/types/chat";

const BASE = "/api/v1/chat-rooms";

// 멱등: 동일 (targetType, targetId)면 같은 방 반환. 단, lazy 생성 정책상 방이 아직 없으면 id=null.
export function createChatRoom(
  targetType: ChatContextType,
  targetId: number
): Promise<CreateChatRoomResult> {
  const body: CreateChatRoomBody = { targetType, targetId };
  return apiClient.post<CreateChatRoomResult>(BASE, body);
}

// 첫 메시지는 STOMP가 아니라 REST로 보내며 방을 생성한다(lazy). 응답 chatRoomId로 이후 STOMP 구독.
export function sendFirstMessage(body: SendFirstMessageBody): Promise<SendFirstMessageResult> {
  return apiClient.post<SendFirstMessageResult>(`${BASE}/messages`, body);
}

// 방 목록(커서). 정렬 lastMessageAt DESC NULLS LAST, id DESC. cursor=직전 nextCursor, size 1~50(기본 20).
export function getChatRooms(
  cursor?: string,
  size?: number
): Promise<CursorPage<ChatRoomListItem>> {
  return apiClient.get<CursorPage<ChatRoomListItem>>(BASE, { cursor, size });
}

export function getChatRoom(roomId: number): Promise<ChatRoom> {
  return apiClient.get<ChatRoom>(`${BASE}/${roomId}`);
}

// 메시지 이력(커서). 최신순 createdAt DESC, id DESC; nextCursor로 과거 더 로드.
// 렌더 시 시간 오름차순으로 뒤집어 표시(useMessages 훅). cursor=직전 nextCursor, size 1~50(기본 20).
export function getMessages(
  roomId: number,
  cursor?: string,
  size?: number
): Promise<CursorPage<Message>> {
  return apiClient.get<CursorPage<Message>>(`${BASE}/${roomId}/messages`, {
    cursor,
    size,
  });
}
