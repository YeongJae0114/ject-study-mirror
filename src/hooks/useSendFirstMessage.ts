// 첫 메시지 전송 mutation. 방이 아직 없을 때 REST로 보내며 방을 생성한다(lazy).
// 성공 시 새 방이 목록에 보이도록 rooms 캐시 invalidate. 방 이동은 컴포넌트에서 처리.

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CHAT_ROOMS_KEY } from "@/hooks/useChatRooms";
import { sendFirstMessage } from "@/services/chatApi";
import type { SendFirstMessageBody, SendFirstMessageResult } from "@/types/chat";

export function useSendFirstMessage() {
  const queryClient = useQueryClient();

  return useMutation<SendFirstMessageResult, Error, SendFirstMessageBody>({
    mutationFn: body => sendFirstMessage(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
    },
  });
}
