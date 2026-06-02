// 채팅 UI 상태만 담는 Zustand store (서버 상태인 메시지·방 목록은 React Query 소유, persist는 auth 팀 담당).

import { create } from 'zustand';

interface ChatUIState {
  /** 입력창 초안 텍스트. */
  draftMessage: string;
  /** 현재 선택/진입한 방 id. */
  selectedRoomId: number | null;

  setDraftMessage: (draftMessage: string) => void;
  setSelectedRoomId: (selectedRoomId: number | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatUIState>((set) => ({
  draftMessage: '',
  selectedRoomId: null,

  setDraftMessage: (draftMessage) => set({ draftMessage }),
  setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),

  reset: () =>
    set({
      draftMessage: '',
      selectedRoomId: null,
    }),
}));
