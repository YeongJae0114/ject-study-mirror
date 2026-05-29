import { create } from "zustand";

interface AuthSignupState {
  nickname: string;
  bio: string;
  role: string | null;
  profileImage: File | null;

  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setRole: (role: string) => void;
  setProfileImage: (file: File | null) => void;
  reset: () => void;
}

export const useAuthSignupStore = create<AuthSignupState>(set => ({
  nickname: "",
  bio: "",
  role: null,
  profileImage: null,

  setNickname: nickname => set({ nickname }),
  setBio: bio => set({ bio }),
  setRole: role => set({ role }),
  setProfileImage: file => set({ profileImage: file }),

  reset: () =>
    set({
      nickname: "",
      bio: "",
      role: null,
      profileImage: null,
    }),
}));
