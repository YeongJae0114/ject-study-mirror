import { create } from "zustand";
import { persist } from "zustand/middleware";

// 토큰·userId 저장소. persist로 localStorage 저장 + 새로고침 자동 복구.
// 채팅 등은 session.ts 어댑터를 통해 이 store를 읽는다.
interface AuthState {
  accessToken: string | null;
  userId: number | null;
  setAuth: (payload: { accessToken: string; userId: number }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      setAuth: ({ accessToken, userId }) => set({ accessToken, userId }),
      clearAuth: () => set({ accessToken: null, userId: null }),
    }),
    { name: "refit-auth" },
  ),
);
