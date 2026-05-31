import { apiClient, clearAccessToken } from "@/services/apiClient";

export interface MeResponse {
  userId: number;
  email: string;
  role: string;
}

interface LogoutResponse {
  message: string;
}

// 마이페이지 화면에서 사용하는 현재 로그인 사용자 조회 API입니다.
export const getMe = () => apiClient<MeResponse>("/api/v1/auth/me");

export const logout = async () => {
  const response = await apiClient<LogoutResponse>("/api/v1/auth/logout", {
    method: "POST",
  });

  clearAccessToken();

  return response;
};
