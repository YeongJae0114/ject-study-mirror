// 채팅방 목록 훅: 커서 페이지네이션(useInfiniteQuery), nextCursor를 pageParam으로 전달.

import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatRooms } from '@/services/chatApi';
import { useSession } from '@/services/session';
import type { ChatRoomListItem, CursorPage } from '@/types/chat';

export const CHAT_ROOMS_KEY = ['chat', 'rooms'] as const;

export function useChatRooms(size?: number) {
  const { accessToken } = useSession();

  return useInfiniteQuery<CursorPage<ChatRoomListItem>>({
    queryKey: CHAT_ROOMS_KEY,
    queryFn: ({ pageParam }) => getChatRooms(pageParam as string | undefined, size),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    // 토큰이 없으면 401이 뻔하므로 호출하지 않는다.
    enabled: Boolean(accessToken),
  });
}
