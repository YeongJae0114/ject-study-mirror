"use client";

import type { ReactNode } from "react";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface MypageLayoutProps {
  children: ReactNode;
}

export default function MypageLayout({ children }: MypageLayoutProps) {
  const { isAuthReady, isAuthenticated } = useRequireAuth("/auth");

  if (!isAuthReady || !isAuthenticated) {
    return null;
  }

  return children;
}
