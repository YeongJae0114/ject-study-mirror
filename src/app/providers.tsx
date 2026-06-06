"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
}

// 클라이언트 전역 Provider. QueryClient는 useState로 한 번만 생성한다.
export default function Providers({ children }: ProvidersProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 실시간 채팅은 소켓이 캐시를 갱신하므로 포커스 재요청은 끈다.
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
