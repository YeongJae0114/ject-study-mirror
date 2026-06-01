"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { exchangeToken } from "@/services/authApi";
import { ApiError } from "@/services/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

interface Guide {
  message: string;
  providers: string[] | null;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [guide, setGuide] = useState<Guide | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // resultKey는 1회용 — 이중 실행 방지
    handled.current = true;

    const resultKey = new URLSearchParams(window.location.search).get(
      "resultKey",
    );
    if (!resultKey) {
      router.replace("/auth/error?error.code=MISSING_RESULT_KEY");
      return;
    }

    exchangeToken(resultKey)
      .then((res) => {
        switch (res.loginStatus) {
          case "LOGIN_SUCCESS":
            if (res.accessToken)
              setAuth({ accessToken: res.accessToken, userId: res.userId });
            router.replace("/");
            break;
          case "SIGNUP_REQUIRED":
            if (res.accessToken)
              setAuth({ accessToken: res.accessToken, userId: res.userId });
            router.replace("/auth/signup/profile");
            break;
          case "LOGIN_METHOD_GUIDE":
            // accessToken 없음 — 기존 가입 방식 안내만
            setGuide({
              message: res.guideMessage ?? "이미 다른 방식으로 가입된 계정이에요.",
              providers: res.registeredProviders,
            });
            break;
          default:
            // 예상치 못한 loginStatus — 무한 로딩 방지, 에러 페이지로 폴백
            router.replace("/auth/error?error.code=UNKNOWN_LOGIN_STATUS");
        }
      })
      .catch((err) => {
        const code = err instanceof ApiError ? err.code : "UNKNOWN_ERROR";
        router.replace(`/auth/error?error.code=${encodeURIComponent(code)}`);
      });
  }, [router, setAuth]);

  if (guide) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="text-body-1 text-text-primary">{guide.message}</div>
        {guide.providers && guide.providers.length > 0 && (
          <div className="text-label text-text-secondary">
            가입된 방식: {guide.providers.join(", ")}
          </div>
        )}
        <button
          type="button"
          onClick={() => router.replace("/auth")}
          className="rounded-sm bg-object-primary px-4 py-2 text-label font-medium text-text-invert"
        >
          로그인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="text-body-1 text-text-secondary">로그인 처리 중...</div>
    </div>
  );
}
