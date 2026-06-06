// 채팅방 생성 mutation: 멱등(기존 방이면 동일 방 반환), 성공 시 rooms 캐시 invalidate. 이동은 컴포넌트에서 처리.

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CHAT_ROOMS_KEY } from "@/hooks/useChatRooms";
import { createChatRoom } from "@/services/chatApi";
import type { ChatContextType, ChatRoom } from "@/types/chat";

export interface CreateChatRoomArgs {
  targetType: ChatContextType;
  targetId: number;
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation<ChatRoom, Error, CreateChatRoomArgs>({
    mutationFn: ({ targetType, targetId }) => createChatRoom(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
    },
  });
}
