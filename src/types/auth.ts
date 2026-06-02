export type OAuthProvider = "google" | "naver";

export type LoginStatus =
  | "LOGIN_SUCCESS" // 기존 소셜 계정 로그인 (accessToken 발급)
  | "SIGNUP_REQUIRED" // 신규 사용자 (accessToken 발급, 프로필 작성 필요)
  | "LOGIN_METHOD_GUIDE"; // 같은 이메일이 다른 방식으로 가입됨 (accessToken null)

export type SignupStep = "OAUTH_VERIFIED" | "PROFILE_REQUIRED" | "COMPLETED";

/** POST /api/v1/auth/token 응답 data */
export interface OAuthLoginResult {
  loginStatus: LoginStatus;
  userId: number;
  registered: boolean;
  signupStep: SignupStep;
  accessToken: string | null; // LOGIN_METHOD_GUIDE 면 null
  guideMessage: string | null; // LOGIN_METHOD_GUIDE 일 때만
  registeredProviders: string[] | null; // LOGIN_METHOD_GUIDE 일 때만
}

/** GET /api/v1/auth/me 응답 data */
export interface MeResult {
  userId: number;
  email: string;
  nickname: string | null;
  bio: string | null;
  profileImageUrl?: string | null;
  role: string;
  snsUrl: string | null;
}
