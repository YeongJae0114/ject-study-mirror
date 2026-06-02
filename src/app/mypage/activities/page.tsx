"use client";

import Header from "@/components/common/Header";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function MypageActivitiesPage() {
  const { isAuthReady, isAuthenticated } = useRequireAuth();

  if (!isAuthReady || !isAuthenticated) return null;

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header title="활동 정보" showBack />

      <section className="px-5 py-6">
        <p className="text-body-2 text-text-secondary font-regular py-2">
          등록된 활동 정보가 없습니다.
        </p>
      </section>
    </main>
  );
}
