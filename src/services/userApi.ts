import { apiClient } from "@/services/apiClient";

export interface NicknamePolicyResponse {
  nickname: string;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
  canChangeNickname: boolean;
  blockedReason?: string;
}

export interface NicknameUpdateResponse {
  userId: number;
  nickname: string;
  nicknameChangeCount: number;
  remainingNicknameChanges: number;
}

// 회원정보 변경 화면에서 닉네임 조회/수정에 사용하는 API입니다.
export const getNicknamePolicy = () =>
  apiClient.get<NicknamePolicyResponse>("/api/v1/users/me/nickname-policy");

export const updateNickname = (nickname: string) =>
  apiClient.patch<NicknameUpdateResponse>("/api/v1/users/me/nickname", { nickname });
