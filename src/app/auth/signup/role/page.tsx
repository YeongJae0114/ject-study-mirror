"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AuthButton from "@/components/auth/AuthButton";
import AuthLayout from "@/components/auth/AuthLayout";
import RoleSelect from "@/components/auth/RoleSelect";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
import { ApiError } from "@/services/apiClient";
import { confirmImageUpload, issueImageUploadUrl, uploadImageToStorage } from "@/services/imageApi";
import { completeWelcome, updateProfile } from "@/services/userApi";
import { useAuthSignupStore } from "@/stores/authSignupStore";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RolePage() {
  const router = useRouter();
  const { canRender } = useOnboardingGuard();
  const { nickname, bio, role, profileImage, signupToken, setRole, reset } = useAuthSignupStore();
  const setAuth = useAuthStore(s => s.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const welcomeMutation = useMutation({
    mutationFn: async () => {
      if (!role) {
        throw new Error("역할을 선택해주세요.");
      }

      if (!signupToken) {
        throw new Error("회원가입 인증 정보가 만료되었습니다. 다시 로그인해주세요.");
      }

      const welcomeResponse = await completeWelcome({
        signupToken,
        nickname: nickname.trim(),
        bio: bio.trim(),
        role,
        profileImageId: null,
      });

      setAuth({ accessToken: welcomeResponse.accessToken, userId: welcomeResponse.userId });

      if (profileImage) {
        try {
          const uploadInfo = await issueImageUploadUrl({
            filename: profileImage.name,
            contentType: profileImage.type,
            fileSize: profileImage.size,
          });
          const uploadResponse = await uploadImageToStorage(uploadInfo.uploadUrl, profileImage);

          if (uploadResponse.ok) {
            const confirmedImage = await confirmImageUpload(uploadInfo.imageId);
            await updateProfile({
              bio: bio.trim(),
              snsUrl: null,
              profileImageUrl: confirmedImage.imageUrl,
            });
          }
        } catch {
          // 프로필 이미지는 선택 항목이므로 계정 생성 성공 후 업로드 실패가 가입 완료를 막지 않는다.
        }
      }

      return welcomeResponse;
    },
    onSuccess: () => {
      reset();
      router.replace("/");
    },
    onError: error => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "서비스 시작 중 오류가 발생했습니다.";
      setErrorMessage(message);
    },
  });

  const handleComplete = () => {
    if (!nickname.trim()) {
      router.replace("/auth/signup/profile");
      return;
    }

    if (!role) return;

    setErrorMessage(null);
    welcomeMutation.mutate();
  };

  const handleBack = () => {
    router.back();
  };

  const isSubmitDisabled = !role || welcomeMutation.isPending;

  if (!canRender) return null;

  return (
    <AuthLayout
      title="역할 선택하기"
      description={"원하시는 역할을 선택해주세요\n역할에 따라 맞춤형 기능이 제공됩니다"}
      background="primary-darker"
      showBackButton
      onBack={handleBack}
      variant="form"
    >
      <div className="space-y-6">
        <RoleSelect selectedRole={role} onRoleSelect={setRole} />

        {errorMessage && (
          <p className="text-caption font-regular text-error-default">{errorMessage}</p>
        )}

        <AuthButton onClick={handleComplete} disabled={isSubmitDisabled}>
          {welcomeMutation.isPending ? "처리 중" : "서비스 시작하기"}
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
