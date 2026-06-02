import { apiClient } from "@/services/apiClient";

export interface NicknamePolicyResponse {
  nickname: string;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
  canChangeNickname: boolean;
  blockedReason?: string;
}

export interface UserProfileUpdateRequest {
  nickname: string;
  bio: string;
  snsUrl: string;
  profileImageUrl?: string | null;
}

export interface UserProfileUpdateResponse {
  userId: number;
  email: string;
  nickname: string;
  bio: string;
  snsUrl: string;
  profileImageUrl?: string | null;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
}

// 회원정보 변경 화면에서 닉네임 정책을 조회할 때 사용하는 API입니다.
export const getNicknamePolicy = () =>
  apiClient.get<NicknamePolicyResponse>("/api/v1/users/me/nickname-policy");

export const updateProfile = (body: UserProfileUpdateRequest) =>
  apiClient.patch<UserProfileUpdateResponse>("/api/v1/users/me", body);
