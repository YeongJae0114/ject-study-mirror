/**
 * Auth 어댑터: 토큰·userId 읽기를 이 파일 한 곳으로 격리(useAuthStore 통합 시 내부만 교체).
 * 기대 인터페이스: accessToken(JWT) string|null, userId number|null.
 */

import { useSyncExternalStore } from 'react';

// 통합 전 임시 구현용 localStorage 키. 팀원 store 연결 시 함께 제거.
const ACCESS_TOKEN_KEY = 'refit.accessToken';
const USER_ID_KEY = 'refit.userId';

/** Access Token 반환(없으면 null). REST Bearer·STOMP CONNECT 헤더용. TODO: useAuthStore 통합 시 교체. */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** 본인 userId 반환(없으면 null). isOwn 계산·개인 큐 /sub/users/{myUserId}/** 구독용. TODO: useAuthStore 통합 시 교체. */
export function getMyUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_ID_KEY);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/** 개발/테스트용 토큰·userId 주입 헬퍼. TODO: useAuthStore 통합 시 제거. */
export function setSessionForDev(accessToken: string, userId: number): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_ID_KEY, String(userId));
  window.dispatchEvent(new Event('refit:session-change'));
}

/** reactive 세션 구독을 위한 최소 subscribe. localStorage·커스텀 이벤트 변화에 반응. */
function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onChange);
  window.addEventListener('refit:session-change', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('refit:session-change', onChange);
  };
}

export interface Session {
  accessToken: string | null;
  myUserId: number | null;
}

// useSyncExternalStore는 동일 참조를 요구하므로 값이 같으면 같은 객체를 재사용한다.
let cachedSession: Session = { accessToken: null, myUserId: null };

function getSnapshot(): Session {
  const accessToken = getAccessToken();
  const myUserId = getMyUserId();
  if (
    cachedSession.accessToken === accessToken &&
    cachedSession.myUserId === myUserId
  ) {
    return cachedSession;
  }
  cachedSession = { accessToken, myUserId };
  return cachedSession;
}

const SERVER_SNAPSHOT: Session = { accessToken: null, myUserId: null };

/** reactive 세션 훅(단발 조회는 getAccessToken/getMyUserId 직접 호출). TODO: useAuthStore 통합 시 교체. */
export function useSession(): Session {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
