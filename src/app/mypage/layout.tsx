"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getMe } from "@/services/authApi";

interface MypageLayoutProps {
  children: ReactNode;
}

export default function MypageLayout({ children }: MypageLayoutProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthReady, isAuthenticated } = useRequireAuth("/auth");
  const canFetchMe = isAuthReady && isAuthenticated;
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchMe,
  });

  useEffect(() => {
    if (meQuery.data?.role === "PENDING") {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.replace("/auth/signup/profile");
    }
  }, [meQuery.data?.role, queryClient, router]);

  if (!canFetchMe || meQuery.isLoading || !meQuery.data || meQuery.data.role === "PENDING") {
    return null;
  }

  return children;
}
