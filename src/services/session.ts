/**
 * Auth 어댑터: 토큰·userId 읽기를 한 곳으로 격리. useAuthStore를 단일 출처로 래핑한다.
 * (채팅 등 소비자는 이 어댑터만 쓰므로, 저장소가 바뀌어도 여기만 고치면 된다.)
 */

import { useAuthStore } from "@/stores/useAuthStore";

/** Access Token 반환(없으면 null). REST Bearer·STOMP CONNECT 헤더용. */
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/** 본인 userId 반환(없으면 null). isOwn 계산·개인 큐 구독용. */
export function getMyUserId(): number | null {
  return useAuthStore.getState().userId;
}

/** 개발/테스트용 토큰·userId 직접 주입(로그인 없이 확인할 때). */
export function setSessionForDev(accessToken: string, userId: number): void {
  useAuthStore.getState().setAuth({ accessToken, userId });
}

export interface Session {
  accessToken: string | null;
  myUserId: number | null;
}

/** reactive 세션 훅(단발 조회는 getAccessToken/getMyUserId 직접 호출). */
export function useSession(): Session {
  const accessToken = useAuthStore(s => s.accessToken);
  const myUserId = useAuthStore(s => s.userId);
  return { accessToken, myUserId };
}
