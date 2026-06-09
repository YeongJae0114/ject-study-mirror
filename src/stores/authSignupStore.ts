import { create } from "zustand";

import type { UserRole } from "@/types/auth";

interface AuthSignupState {
  nickname: string;
  bio: string;
  role: UserRole | null;
  profileImage: File | null;
  signupToken: string | null;

  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setRole: (role: UserRole) => void;
  setProfileImage: (file: File | null) => void;
  setSignupToken: (signupToken: string | null) => void;
  reset: () => void;
}

export const useAuthSignupStore = create<AuthSignupState>(set => ({
  nickname: "",
  bio: "",
  role: null,
  profileImage: null,
  signupToken: null,

  setNickname: nickname => set({ nickname }),
  setBio: bio => set({ bio }),
  setRole: role => set({ role }),
  setProfileImage: file => set({ profileImage: file }),
  setSignupToken: signupToken => set({ signupToken }),

  reset: () =>
    set({
      nickname: "",
      bio: "",
      role: null,
      profileImage: null,
      signupToken: null,
    }),
}));
