/**
 * 메시지 이력 훅 (커서 페이지네이션). 응답은 DESC라 화면에선 오름차순으로 뒤집어 표시, 위로 스크롤 시 과거 로드.
 * 키 ['chat','messages',roomId]는 useChatSocket의 실시간 머지 지점.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '@/services/chatApi';
import { useSession } from '@/services/session';
import type { CursorPage, Message } from '@/types/chat';

export function messagesKey(roomId: number) {
  return ['chat', 'messages', roomId] as const;
}

export function useMessages(roomId: number, size?: number) {
  const { accessToken } = useSession();

  return useInfiniteQuery<CursorPage<Message>>({
    queryKey: messagesKey(roomId),
    queryFn: ({ pageParam }) =>
      getMessages(roomId, pageParam as string | undefined, size),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(accessToken) && Number.isFinite(roomId),
  });
}
