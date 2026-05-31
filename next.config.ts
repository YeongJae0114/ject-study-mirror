import type { NextConfig } from "next";

// REST 프록시 (CORS 회피)
// 브라우저는 같은 오리진(/api/*)으로 요청 → next 서버가 백엔드로 프록시한다.
// 백엔드 오리진은 BACKEND_ORIGIN 환경변수(.env.local)로 지정. 미설정 시 로컬 기본값.
// (WebSocket/STOMP는 프록시를 거치지 않고 NEXT_PUBLIC_WS_URL로 직접 연결 — WS는 CORS 무관)
const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendOrigin}/api/:path*` },
    ];
  },
};

export default nextConfig;
