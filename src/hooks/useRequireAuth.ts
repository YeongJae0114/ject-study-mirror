"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/useAuthStore";

export function useRequireAuth(redirectTo = "/auth") {
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const [isAuthReady, setIsAuthReady] = useState(() => {
    if (typeof window === "undefined") return false;

    return useAuthStore.persist?.hasHydrated?.() ?? false;
  });

  useEffect(() => {
    return useAuthStore.persist?.onFinishHydration?.(() => {
      setIsAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isAuthReady || accessToken) return;

    router.replace(redirectTo);
  }, [accessToken, isAuthReady, redirectTo, router]);

  return {
    isAuthReady,
    isAuthenticated: Boolean(accessToken),
  };
}
