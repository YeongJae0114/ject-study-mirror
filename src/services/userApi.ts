import { apiClient } from "@/services/apiClient";
import type { UserRole } from "@/types/auth";

export interface NicknamePolicyResponse {
  nickname: string;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
  canChangeNickname: boolean;
  blockedReason?: string;
}

export interface UserProfileUpdateRequest {
  nickname?: string;
  bio: string;
  snsUrl: string | null;
  profileImageUrl?: string;
}

export interface UserProfileUpdateResponse {
  userId: number;
  email: string;
  nickname: string;
  bio: string;
  snsUrl: string | null;
  profileImageUrl?: string | null;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
}

export interface WelcomeRequest {
  signupToken: string;
  nickname: string;
  bio: string;
  role: UserRole;
  profileImageId: number | null;
}

export interface WelcomeResponse {
  userId: number;
  email: string;
  nickname: string;
  bio: string | null;
  role: string;
  accessToken: string;
  profileImageUrl?: string | null;
}

export interface NicknameCheckResponse {
  available: boolean;
}

// 회원정보 변경 화면에서 닉네임 정책을 조회할 때 사용하는 API입니다.
export const getNicknamePolicy = (signal?: AbortSignal) =>
  apiClient.get<NicknamePolicyResponse>("/api/v1/users/me/nickname-policy", undefined, signal);

export const updateProfile = (body: UserProfileUpdateRequest) =>
  apiClient.patch<UserProfileUpdateResponse>("/api/v1/users/me", body);

export const withdrawMe = () => apiClient.delete<{ message: string }>("/api/v1/users/me");

export const completeWelcome = (body: WelcomeRequest) =>
  apiClient.put<WelcomeResponse>("/api/v1/users/welcome", body);

export const checkNickname = (nickname: string) =>
  apiClient.post<NicknameCheckResponse>("/api/v1/users/check-nickname", { nickname });
