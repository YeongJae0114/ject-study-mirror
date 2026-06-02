"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ConfirmModal from "@/components/mypage/ConfirmModal";
import SettingMenuItem from "@/components/mypage/SettingMenuItem";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { logout } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";

type ModalType = "logout" | "withdraw" | null;

const MODAL_CONTENT = {
  logout: {
    title: "로그아웃 하시겠어요?",
    description: "현재 계정에서 로그아웃됩니다.",
    confirmText: "로그아웃",
    tone: "default" as const,
  },
  withdraw: {
    title: "탈퇴 전 확인해주세요",
    description: "탈퇴하면 계정 정보와 활동 내역을\n다시 복구할 수 없습니다.",
    confirmText: "회원탈퇴",
    tone: "danger" as const,
  },
};

export default function MyPageSettingsPage() {
  const router = useRouter();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const [modalType, setModalType] = useState<ModalType>(null);
  const modalContent = modalType ? MODAL_CONTENT[modalType] : null;
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      setModalType(null);
      router.push("/auth");
    },
  });

  const closeModal = () => {
    setModalType(null);
  };

  const handleConfirm = () => {
    if (modalType === "logout") {
      logoutMutation.mutate();
      return;
    }

    // 회원탈퇴 API는 현재 구현 범위에 없어 모달 UI만 유지합니다.
    closeModal();
  };

  if (!isAuthReady || !isAuthenticated) return null;

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header title="설정" showBack showBorder={false} />

      <section className="w-full px-5 pt-1">
        <div className="flex flex-col">
          <SettingMenuItem
            title="회원정보 변경"
            hasDivider
            onClick={() => router.push("/mypage/settings/profile")}
          />
          <SettingMenuItem title="로그아웃" hasDivider onClick={() => setModalType("logout")} />
          <SettingMenuItem title="회원탈퇴" onClick={() => setModalType("withdraw")} />
        </div>
      </section>

      {modalContent && (
        <ConfirmModal
          open={Boolean(modalContent)}
          title={modalContent.title}
          description={modalContent.description}
          confirmText={modalContent.confirmText}
          tone={modalContent.tone}
          isConfirmLoading={modalType === "logout" && logoutMutation.isPending}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
}
