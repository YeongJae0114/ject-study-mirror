"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserRole } from "@/types/auth";

/**
 * 현재 로그인한 사용자의 role을 조회한다.
 * - 비로그인 시 쿼리를 끄고 role은 undefined.
 * - ["auth", "me"] 키를 공유해 다른 곳의 me 캐시를 재사용한다.
 */
export function useMyRole() {
  const accessToken = useAuthStore(state => state.accessToken);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    role: query.data?.role as UserRole | undefined,
    isLoggedIn: Boolean(accessToken),
    isRoleLoading: query.isLoading,
  };
}
