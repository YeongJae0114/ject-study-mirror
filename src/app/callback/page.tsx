"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function OAuthCallbackAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/auth/callback${window.location.search}`);
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="text-body-1 text-text-secondary">로그인 처리 중...</div>
    </div>
  );
}
