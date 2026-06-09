"use client";

import type { ReactNode } from "react";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isAuthReady, isAuthenticated } = useRequireAuth("/auth");

  if (!isAuthReady || !isAuthenticated) {
    return null;
  }

  return children;
}
