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
    // error.message(쿼리 값)는 신뢰할 수 없어 표시하지 않는다.
    // 매핑된 code만 안내하고, 빈/미매핑 code는 일반 메시지로 폴백(|| 로 빈 문자열도 처리).
    const code = new URLSearchParams(window.location.search).get("error.code");
    setMessage((code && ERROR_MESSAGES[code]) || "로그인에 실패했어요.");
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
