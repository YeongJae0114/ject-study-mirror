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
import { getNicknamePolicy, updateNickname } from "@/services/userApi";

interface ProfileFormValues {
  nickname: string | null;
  bio: string;
  snsUrl: string;
  profileImage: File | null;
}

interface ProfileFormErrors {
  nickname?: string;
  bio?: string;
  snsUrl?: string;
}

const INITIAL_FORM_VALUES: ProfileFormValues = {
  nickname: null,
  bio: "",
  snsUrl: "",
  profileImage: null,
};

// 현재 백엔드에 연결된 수정 API는 닉네임만 제공됩니다.
// 자기소개, SNS, 프로필 이미지는 UI 입력/검증만 유지하고 추후 API 명세에 맞춰 연결합니다.
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
  const nicknameMutation = useMutation({
    mutationFn: updateNickname,
    onSuccess: data => {
      setFormValues(prev => ({ ...prev, nickname: data.nickname }));
      queryClient.invalidateQueries({ queryKey: ["users", "me", "nickname-policy"] });
      setIsToastOpen(true);
    },
    onError: error => {
      const message =
        error instanceof ApiError ? error.message : "닉네임 수정 중 오류가 발생했습니다.";
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
    const nickname = (formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? "").trim();
    const currentNickname = nicknamePolicyQuery.data?.nickname ?? "";

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

    if (formValues.bio.length > 100) {
      nextErrors.bio = "자기소개는 최대 100자까지 입력해주세요.";
    }

    if (!isValidUrl(formValues.snsUrl)) {
      nextErrors.snsUrl = "http:// 또는 https://로 시작하는 링크를 입력해주세요.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const nickname = (formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? "").trim();
    const currentNickname = nicknamePolicyQuery.data?.nickname ?? "";

    if (!currentNickname || nickname === currentNickname) {
      setIsToastOpen(true);
      return;
    }

    // Swagger 기준 PATCH /api/v1/users/me/nickname만 실제 저장 요청을 보냅니다.
    nicknameMutation.mutate(nickname);
  };

  const isSubmitDisabled =
    !canFetchProfile ||
    meQuery.isLoading ||
    nicknamePolicyQuery.isLoading ||
    nicknameMutation.isPending ||
    !(formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? "").trim() ||
    (formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? "").trim().length < 2 ||
    (formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? "").length > 10 ||
    formValues.bio.length > 100 ||
    !isValidUrl(formValues.snsUrl);

  if (!canFetchProfile) return null;

  return (
    <main className="bg-bg-primary min-h-dvh overflow-hidden">
      <Header title="회원정보 변경" showBack />

      <section className="fixed top-15 right-0 bottom-[82px] left-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-107.5 flex-col gap-6 px-5 py-6">
          <ProfileImageInput
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
              value={formValues.nickname ?? nicknamePolicyQuery.data?.nickname ?? ""}
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
              value={formValues.bio}
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
              value={formValues.snsUrl}
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
        <div className="mx-auto w-full max-w-107.5">
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
            {nicknameMutation.isPending ? "수정 중" : "수정 완료"}
          </button>
        </div>
      </div>

      <Toast open={isToastOpen} message="수정 완료되었습니다." />
    </main>
  );
}
