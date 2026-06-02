"use client";

import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Header from "@/components/common/Header";
import ProfileImageInput from "@/components/mypage/ProfileImageInput";
import ProfileTextField from "@/components/mypage/ProfileTextField";
import Toast from "@/components/mypage/Toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiError } from "@/services/apiClient";
import { getMe } from "@/services/authApi";
import { issueImageUploadUrl, uploadImageToStorage } from "@/services/imageApi";
import { getNicknamePolicy, updateProfile } from "@/services/userApi";

interface ProfileFormValues {
  nickname: string | null;
  bio: string | null;
  snsUrl: string | null;
  profileImage: File | null;
}

interface ProfileFormErrors {
  nickname?: string;
  bio?: string;
  snsUrl?: string;
}

const INITIAL_FORM_VALUES: ProfileFormValues = {
  nickname: null,
  bio: null,
  snsUrl: null,
  profileImage: null,
};

const isValidUrl = (value: string) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function MyPageProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetchProfile = isAuthReady && isAuthenticated;
  const [formValues, setFormValues] = useState<ProfileFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: canFetchProfile,
  });
  const nicknamePolicyQuery = useQuery({
    queryKey: ["users", "me", "nickname-policy"],
    queryFn: getNicknamePolicy,
    enabled: canFetchProfile,
  });
  const nicknameValue =
    formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? meQuery.data?.nickname ?? "";
  const bioValue = formValues.bio ?? meQuery.data?.bio ?? "";
  const snsUrlValue = formValues.snsUrl ?? meQuery.data?.snsUrl ?? "";
  const profileMutation = useMutation({
    mutationFn: async () => {
      const nickname = nicknameValue.trim();
      let profileImageUrl = meQuery.data?.profileImageUrl ?? null;

      if (formValues.profileImage) {
        const uploadInfo = await issueImageUploadUrl({
          filename: formValues.profileImage.name,
          contentType: formValues.profileImage.type,
          fileSize: formValues.profileImage.size,
        });
        const uploadResponse = await uploadImageToStorage(
          uploadInfo.uploadUrl,
          formValues.profileImage
        );

        if (!uploadResponse.ok) {
          throw new Error("프로필 이미지 업로드 중 오류가 발생했습니다.");
        }

        profileImageUrl = uploadInfo.imageUrl;
      }

      return updateProfile({
        nickname,
        bio: bioValue.trim(),
        snsUrl: snsUrlValue.trim(),
        profileImageUrl,
      });
    },
    onSuccess: data => {
      setFormValues(prev => ({
        ...prev,
        nickname: data.nickname,
        bio: data.bio ?? "",
        snsUrl: data.snsUrl ?? "",
        profileImage: null,
      }));
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me", "nickname-policy"] });
      setIsToastOpen(true);
    },
    onError: error => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "회원정보 수정 중 오류가 발생했습니다.";
      setErrors(prev => ({ ...prev, nickname: message }));
    },
  });

  useEffect(() => {
    if (!isToastOpen) return;

    const timer = window.setTimeout(() => {
      setIsToastOpen(false);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isToastOpen]);

  const updateField = <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const nextErrors: ProfileFormErrors = {};
    const nickname = nicknameValue.trim();
    const currentNickname = nicknamePolicyQuery.data?.nickname ?? meQuery.data?.nickname ?? "";

    if (!nickname) {
      nextErrors.nickname = "닉네임을 입력해주세요.";
    } else if (nickname.length < 2) {
      nextErrors.nickname = "닉네임은 2자 이상 입력해주세요.";
    } else if (nickname.length > 10) {
      nextErrors.nickname = "닉네임은 최대 10자까지 입력해주세요.";
    } else if (
      currentNickname &&
      nickname !== currentNickname &&
      nicknamePolicyQuery.data?.canChangeNickname === false
    ) {
      nextErrors.nickname =
        nicknamePolicyQuery.data.blockedReason ?? "현재 닉네임을 변경할 수 없습니다.";
    }

    if (bioValue.length > 100) {
      nextErrors.bio = "자기소개는 최대 100자까지 입력해주세요.";
    }

    if (!isValidUrl(snsUrlValue)) {
      nextErrors.snsUrl = "http:// 또는 https://로 시작하는 링크를 입력해주세요.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    profileMutation.mutate();
  };

  const isSubmitDisabled =
    !canFetchProfile ||
    meQuery.isLoading ||
    nicknamePolicyQuery.isLoading ||
    profileMutation.isPending ||
    !nicknameValue.trim() ||
    nicknameValue.trim().length < 2 ||
    nicknameValue.length > 10 ||
    bioValue.length > 100 ||
    !isValidUrl(snsUrlValue);

  if (!canFetchProfile) return null;

  return (
    <main className="bg-bg-primary min-h-dvh overflow-hidden">
      <Header title="회원정보 변경" showBack />

      <section className="fixed top-15 right-0 bottom-[82px] left-0 overflow-y-auto">
        <div className="flex w-full flex-col gap-6 px-5 py-6">
          <ProfileImageInput
            initialImageUrl={meQuery.data?.profileImageUrl}
            onChange={file => {
              updateField("profileImage", file);
            }}
          />

          <div className="flex flex-col gap-5">
            <ProfileTextField
              label="이메일"
              value={meQuery.data?.email ?? ""}
              disabled
              onChange={() => undefined}
            />

            <ProfileTextField
              label="닉네임"
              value={nicknameValue}
              placeholder="닉네임을 입력해주세요."
              description={
                nicknamePolicyQuery.data
                  ? `남은 닉네임 변경 횟수 ${nicknamePolicyQuery.data.remainingNicknameChanges}회`
                  : undefined
              }
              required
              maxLength={10}
              error={errors.nickname}
              onChange={value => {
                updateField("nickname", value);
                if (errors.nickname) {
                  setErrors(prev => ({ ...prev, nickname: undefined }));
                }
              }}
            />

            <ProfileTextField
              label="자기소개"
              value={bioValue}
              placeholder="나를 소개해주세요."
              type="textarea"
              maxLength={100}
              error={errors.bio}
              onChange={value => {
                updateField("bio", value);
                if (errors.bio) {
                  setErrors(prev => ({ ...prev, bio: undefined }));
                }
              }}
            />

            <ProfileTextField
              label="SNS 링크"
              value={snsUrlValue}
              placeholder="SNS 링크를 입력해주세요."
              type="url"
              error={errors.snsUrl}
              onChange={value => {
                updateField("snsUrl", value);
                if (errors.snsUrl) {
                  setErrors(prev => ({ ...prev, snsUrl: undefined }));
                }
              }}
            />
          </div>
        </div>
      </section>

      <div className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 border-t px-5 py-4">
        <div className="w-full">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`text-body-1 h-12.5 w-full rounded-lg font-medium transition-colors ${
              isSubmitDisabled
                ? "bg-object-disabled text-text-disabled cursor-not-allowed"
                : "bg-object-primary text-text-invert"
            }`}
          >
            {profileMutation.isPending ? "수정 중" : "수정 완료"}
          </button>
        </div>
      </div>

      <Toast open={isToastOpen} message="수정 완료되었습니다." />
    </main>
  );
}
