"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getMe } from "@/services/authApi";

export default function MypageFeedPage() {
  const router = useRouter();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetchMe = isAuthReady && isAuthenticated;
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchMe,
  });

  if (!isAuthReady || !isAuthenticated) return null;

  const handleCreateClick = () => {
    if (meQuery.data?.role === "CREATOR") {
      router.push("/art/new");
      return;
    }

    if (meQuery.data?.role === "SPACE_PARTNER") {
      router.push("/space/new");
      return;
    }

    router.push("/auth/signup/profile");
  };

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header
        title="피드"
        showBack
        right={
          <button
            type="button"
            aria-label="피드 등록"
            onClick={handleCreateClick}
            disabled={meQuery.isLoading}
            className="text-object-primary flex size-6 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        }
      />

      <section className="px-5 py-6">
        <p className="text-body-2 text-text-secondary font-regular py-2">등록된 피드가 없습니다.</p>
      </section>
    </main>
  );
}
