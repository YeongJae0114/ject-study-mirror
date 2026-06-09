"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getMe } from "@/services/authApi";
import { useAuthSignupStore } from "@/stores/authSignupStore";
import { useAuthStore } from "@/stores/useAuthStore";

const AUTH_STORAGE_KEY = "refit-auth";

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawAuth) return null;

    const parsedAuth = JSON.parse(rawAuth) as {
      state?: { accessToken?: string | null; userId?: number | null };
    };
    return parsedAuth.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

export function useOnboardingGuard(redirectTo = "/") {
  const router = useRouter();
  const signupToken = useAuthSignupStore(state => state.signupToken);
  const accessToken = useAuthStore(state => state.accessToken);
  const [hasStoredAccessToken, setHasStoredAccessToken] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncStoredAuth = () => {
      const storedAccessToken = getStoredAccessToken();

      setHasStoredAccessToken(Boolean(storedAccessToken));

      if (!useAuthStore.getState().accessToken && storedAccessToken) {
        useAuthStore.setState({ accessToken: storedAccessToken });
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

  const canFetchMe = !signupToken && isAuthReady && Boolean(accessToken || hasStoredAccessToken);
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchMe,
    retry: false,
  });

  useEffect(() => {
    if (signupToken || !isAuthReady) return;

    if (!accessToken && !hasStoredAccessToken) {
      router.replace("/auth");
      return;
    }

    if (meQuery.data?.signupStep === "COMPLETED") {
      router.replace(redirectTo);
      return;
    }

    if (meQuery.isError) {
      router.replace("/auth");
    }
  }, [
    accessToken,
    hasStoredAccessToken,
    isAuthReady,
    meQuery.data?.signupStep,
    meQuery.isError,
    redirectTo,
    router,
    signupToken,
  ]);

  return {
    canRender:
      Boolean(signupToken) ||
      (canFetchMe && meQuery.isSuccess && meQuery.data.signupStep !== "COMPLETED"),
  };
}
