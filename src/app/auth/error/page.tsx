"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  OAUTH_AUTHORIZATION_FAILED: "소셜 인증에 실패했어요. 다시 시도해주세요.",
  OAUTH_EMAIL_REQUIRED: "소셜 계정에 이메일이 없어 로그인할 수 없어요.",
  OAUTH_LOGIN_RESULT_NOT_FOUND: "로그인 정보가 만료됐어요. 다시 로그인해주세요.",
  MISSING_RESULT_KEY: "비정상적인 접근이에요.",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const [message, setMessage] = useState("로그인에 실패했어요.");

  useEffect(() => {
    // 실패 콜백은 쿼리 키에 점(.)이 들어간다: error.code, error.message
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error.code");
    const serverMessage = params.get("error.message");
    setMessage(
      (code && ERROR_MESSAGES[code]) ?? serverMessage ?? "로그인에 실패했어요.",
    );
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="text-body-1 text-text-primary">{message}</div>
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
