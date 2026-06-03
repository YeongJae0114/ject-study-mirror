export const PROFILE_VALIDATION_MESSAGES = {
  NICKNAME_REQUIRED: "닉네임을 입력해주세요.",
  NICKNAME_MIN_LENGTH: "닉네임은 2자 이상 입력해주세요.",
  NICKNAME_MAX_LENGTH: "닉네임은 최대 10자까지 입력해주세요.",
  NICKNAME_DUPLICATED: "이미 사용중인 닉네임입니다.",
  NICKNAME_CHECK_FAILED: "닉네임 확인 중 오류가 발생했습니다.",
  NICKNAME_CHANGE_BLOCKED: "현재 닉네임을 변경할 수 없습니다.",
  BIO_MAX_LENGTH: "자기소개는 최대 100자까지 입력해주세요.",
  SNS_URL_INVALID: "http:// 또는 https://로 시작하는 링크를 입력해주세요.",
  PROFILE_UPDATE_FAILED: "회원정보 수정 중 오류가 발생했습니다.",
} as const;
