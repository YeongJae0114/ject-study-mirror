export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

interface ApiErrorField {
  field?: string;
  message?: string;
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    fields?: ApiErrorField[];
  };
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.refitspace.art";

// 기존 로그인 구현에서 사용할 수 있는 토큰 키를 함께 확인합니다.
const ACCESS_TOKEN_KEYS = ["accessToken", "refit_access_token"];

export class ApiError extends Error {
  status: number;
  code?: string;
  fields?: ApiErrorField[];

  constructor(status: number, message: string, code?: string, fields?: ApiErrorField[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;

  for (const key of ACCESS_TOKEN_KEYS) {
    const token = window.localStorage.getItem(key);
    if (token) return token;
  }

  return null;
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;

  ACCESS_TOKEN_KEYS.forEach(key => {
    window.localStorage.removeItem(key);
  });
};

export const apiClient = async <T>(path: string, options: RequestOptions = {}) => {
  const { body, headers, auth = true, ...init } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T> | ApiErrorBody) : undefined;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorBody | undefined;
    const apiError = errorPayload?.error;

    throw new ApiError(
      response.status,
      apiError?.message ?? "요청 처리 중 오류가 발생했습니다.",
      apiError?.code,
      apiError?.fields
    );
  }

  // Swagger 응답 공통 포맷이 { data, meta }라 화면에서는 data만 사용합니다.
  return (payload as ApiResponse<T>).data;
};
