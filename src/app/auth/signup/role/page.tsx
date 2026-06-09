"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AuthButton from "@/components/auth/AuthButton";
import AuthLayout from "@/components/auth/AuthLayout";
import RoleSelect from "@/components/auth/RoleSelect";
import { ApiError } from "@/services/apiClient";
import { confirmImageUpload, issueImageUploadUrl, uploadImageToStorage } from "@/services/imageApi";
import { completeWelcome } from "@/services/userApi";
import { useAuthSignupStore } from "@/stores/authSignupStore";

export default function RolePage() {
  const router = useRouter();
  const { nickname, bio, role, profileImage, setRole, reset } = useAuthSignupStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const welcomeMutation = useMutation({
    mutationFn: async () => {
      if (!role) {
        throw new Error("역할을 선택해주세요.");
      }

      let profileImageId: number | null = null;

      if (profileImage) {
        const uploadInfo = await issueImageUploadUrl({
          filename: profileImage.name,
          contentType: profileImage.type,
          fileSize: profileImage.size,
        });
        const uploadResponse = await uploadImageToStorage(uploadInfo.uploadUrl, profileImage);

        if (!uploadResponse.ok) {
          throw new Error("프로필 이미지 업로드 중 오류가 발생했습니다.");
        }

        await confirmImageUpload(uploadInfo.imageId);

        profileImageId = uploadInfo.imageId;
      }

      return completeWelcome({
        nickname: nickname.trim(),
        bio: bio.trim(),
        role,
        profileImageId,
      });
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
