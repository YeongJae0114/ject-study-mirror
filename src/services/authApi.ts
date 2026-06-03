import { apiClient } from "@/services/apiClient";
import type { MeResult, OAuthLoginResult, OAuthProvider } from "@/types/auth";

// OAuth 시작은 전체 페이지 이동(fetch 아님). 백엔드가 302로 소셜 제공자로 보낸다.
// 프록시를 거치지 않도록 백엔드 절대 origin을 직접 사용한다.
const AUTH_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "https://api.refitspace.art";

/** 소셜 로그인 시작 — 브라우저를 백엔드 OAuth 진입점으로 이동시킨다. */
export function startOAuth(provider: OAuthProvider): void {
  window.location.href = `${AUTH_ORIGIN}/api/v1/auth/oauth/${provider}/start`;
}

/** resultKey → accessToken 교환 (1회용·5분 TTL, 콜백에서 즉시 호출). 인증 불필요. */
export function exchangeToken(resultKey: string): Promise<OAuthLoginResult> {
  return apiClient.post<OAuthLoginResult>("/api/v1/auth/token", { resultKey });
}

/** 내 정보 조회. */
export function getMe(): Promise<MeResult> {
  return apiClient.get<MeResult>("/api/v1/auth/me");
}

/** 로그아웃 — 서버가 Redis에서 토큰 무효화. */
export function logout(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/api/v1/auth/logout");
}

/** 토큰 재발급 — 아직 유효한 토큰만 가능. 만료된 토큰은 재로그인 필요. */
export function reissue(): Promise<{ accessToken: string }> {
  return apiClient.post<{ accessToken: string }>("/api/v1/auth/reissue");
}
