"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/useAuthStore";

const AUTH_STORAGE_KEY = "refit-auth";

interface StoredAuthState {
  accessToken: string | null;
  userId: number | null;
}

function getStoredAuthState(): StoredAuthState | null {
  if (typeof window === "undefined") return null;

  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawAuth) return null;

    const parsedAuth = JSON.parse(rawAuth) as {
      state?: Partial<StoredAuthState>;
    };
    const accessToken = parsedAuth.state?.accessToken;

    if (!accessToken) return null;

    return {
      accessToken,
      userId: parsedAuth.state?.userId ?? null,
    };
  } catch {
    return null;
  }
}

export function useRequireAuth(redirectTo = "/auth") {
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const [hasStoredAccessToken, setHasStoredAccessToken] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncStoredAuth = () => {
      const storedAuth = getStoredAuthState();
      const currentAuth = useAuthStore.getState();

      setHasStoredAccessToken(Boolean(storedAuth?.accessToken));

      if (!currentAuth.accessToken && storedAuth?.accessToken) {
        useAuthStore.setState({
          accessToken: storedAuth.accessToken,
          userId: storedAuth.userId,
        });
      }

      setIsAuthReady(true);
    };

    const unsubscribe = useAuthStore.persist?.onFinishHydration?.(syncStoredAuth);
    const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

    if (hasHydrated) {
      syncStoredAuth();
    } else {
      useAuthStore.persist?.rehydrate?.();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthReady || accessToken || hasStoredAccessToken) return;

    router.replace(redirectTo);
  }, [accessToken, hasStoredAccessToken, isAuthReady, redirectTo, router]);

  return {
    isAuthReady,
    isAuthenticated: Boolean(accessToken || hasStoredAccessToken),
  };
}
