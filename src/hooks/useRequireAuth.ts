"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getMe, reissue } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";

const AUTH_STORAGE_KEY = "refit-auth";
let restoreAuthPromise: Promise<boolean> | null = null;

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

function restoreAuthFromRefreshCookie() {
  if (!restoreAuthPromise) {
    restoreAuthPromise = (async () => {
      try {
        const tokenData = await reissue();
        if (!tokenData.accessToken) return false;

        useAuthStore.setState({ accessToken: tokenData.accessToken });

        const me = await getMe();
        useAuthStore.setState({ userId: me.userId });

        return true;
      } catch {
        useAuthStore.getState().clearAuth();
        return false;
      }
    })().finally(() => {
      restoreAuthPromise = null;
    });
  }

  return restoreAuthPromise;
}

export function useRequireAuth(redirectTo = "/auth") {
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const [hasStoredAccessToken, setHasStoredAccessToken] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const syncStoredAuth = () => {
      const storedAuth = getStoredAuthState();
      const currentAuth = useAuthStore.getState();

      if (currentAuth.accessToken) {
        setHasStoredAccessToken(false);
        setIsAuthReady(true);
        return;
      }

      setHasStoredAccessToken(Boolean(storedAuth?.accessToken));

      if (storedAuth?.accessToken) {
        useAuthStore.setState({
          accessToken: storedAuth.accessToken,
          userId: storedAuth.userId,
        });
        setIsAuthReady(true);
        return;
      }

      void restoreAuthFromRefreshCookie().finally(() => {
        if (!cancelled) {
          setIsAuthReady(true);
        }
      });
    };

    const unsubscribe = useAuthStore.persist?.onFinishHydration?.(syncStoredAuth);
    const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

    if (hasHydrated) {
      syncStoredAuth();
    } else {
      useAuthStore.persist?.rehydrate?.();
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
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
