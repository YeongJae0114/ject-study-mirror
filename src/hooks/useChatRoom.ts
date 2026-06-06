/**
 * 채팅방 단건 상세 훅. 딥링크/새로고침 등 목록을 거치지 않은 직접 진입을 지원. 키: ['chat','room', roomId].
 * ⚠️ ChatRoom에는 counterparty가 없으니 상대방은 artist/host 중 myUserId가 아닌 쪽으로 계산(02_data-contract.md §7).
 */

import { useQuery } from "@tanstack/react-query";

import { getChatRoom } from "@/services/chatApi";
import { getAccessToken } from "@/services/session";
import type { ChatRoom } from "@/types/chat";

export function chatRoomKey(roomId: number) {
  return ["chat", "room", roomId] as const;
}

export function useChatRoom(roomId: number) {
  return useQuery<ChatRoom>({
    queryKey: chatRoomKey(roomId),
    queryFn: () => getChatRoom(roomId),
    // 토큰 없으면 401 확정, roomId 유효성도 함께 게이팅.
    enabled: Boolean(getAccessToken()) && Number.isFinite(roomId),
  });
}
