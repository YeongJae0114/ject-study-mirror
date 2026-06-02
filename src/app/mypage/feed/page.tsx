"use client";

import Header from "@/components/common/Header";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function MypageFeedPage() {
  const { isAuthReady, isAuthenticated } = useRequireAuth();

  if (!isAuthReady || !isAuthenticated) return null;

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header title="피드" showBack />

      <section className="px-5 py-6">
        <p className="text-body-2 text-text-secondary font-regular py-2">등록된 피드가 없습니다.</p>
      </section>
    </main>
  );
}
