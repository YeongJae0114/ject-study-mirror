/**
 * 공통 REST fetch 래퍼: auth 통합 지점(session.ts에서 Bearer 토큰 주입), `{ data, meta }`에서 `.data`만 언랩, 비-2xx는 `error.code`로 ApiError throw.
 * Base URL은 NEXT_PUBLIC_API_BASE. 미설정 시 빈 문자열 → 상대경로로 next dev rewrites 프록시를 타 CORS 회피.
 */

import { getAccessToken } from "@/services/session";
import type { ApiEnvelope, ApiErrorBody } from "@/types/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** REST 에러. error.code로 분기하고, message는 표시용. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fields: Array<{ field: string; reason: string }> | null;

  constructor(
    code: string,
    message: string,
    status: number,
    fields: Array<{ field: string; reason: string }> | null = null
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** 쿼리스트링 파라미터. undefined/null 값은 제외된다. */
  query?: Record<string, string | number | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${API_BASE}${path}`;
  if (!query) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

/** 성공 시 ApiEnvelope<T>의 `.data` 반환, 실패 시 ApiError throw. */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query } = options;

  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let code = "UNKNOWN_ERROR";
    let message = response.statusText || "요청에 실패했습니다.";
    let fields: Array<{ field: string; reason: string }> | null = null;
    try {
      const errorBody = (await response.json()) as ApiErrorBody;
      if (errorBody?.error) {
        code = errorBody.error.code ?? code;
        message = errorBody.error.message ?? message;
        fields = errorBody.error.fields ?? null;
      }
    } catch {
      // 본문이 JSON이 아닐 수 있다 — status 기반 기본값 유지.
    }
    throw new ApiError(code, message, response.status, fields);
  }

  // 204 등 본문 없는 응답 방어.
  const text = await response.text();
  if (!text) return undefined as T;
  const envelope = JSON.parse(text) as ApiEnvelope<T>;
  return envelope.data;
}

export const apiClient = {
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string, body?: unknown) => request<T>(path, { method: "DELETE", body }),
};
