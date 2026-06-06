"use client";

import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ProfileImageInput from "@/components/mypage/ProfileImageInput";
import ProfileTextField from "@/components/mypage/ProfileTextField";
import Toast from "@/components/mypage/Toast";
import { PROFILE_VALIDATION_MESSAGES } from "@/constants/profile";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiError } from "@/services/apiClient";
import { getMe } from "@/services/authApi";
import { issueImageUploadUrl, uploadImageToStorage } from "@/services/imageApi";
import {
  checkNickname,
  getNicknamePolicy,
  updateProfile,
  type UserProfileUpdateRequest,
} from "@/services/userApi";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetchProfile = isAuthReady && isAuthenticated;
  const [formValues, setFormValues] = useState<ProfileFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchProfile,
  });
  const nicknamePolicyQuery = useQuery({
    queryKey: ["users", "me", "nickname-policy"],
    queryFn: ({ signal }) => getNicknamePolicy(signal),
    enabled: canFetchProfile,
  });
  const isNicknameLimitExceeded =
    nicknamePolicyQuery.error instanceof ApiError &&
    nicknamePolicyQuery.error.code === "LIMIT_EXCEEDED";
  const currentNickname = nicknamePolicyQuery.data?.nickname ?? meQuery.data?.nickname ?? "";
  const isNicknameChangeBlocked =
    nicknamePolicyQuery.data?.canChangeNickname === false || isNicknameLimitExceeded;
  const nicknameValue = isNicknameChangeBlocked
    ? currentNickname
    : (formValues.nickname ?? currentNickname);
  const nicknameDescription = isNicknameLimitExceeded
    ? PROFILE_VALIDATION_MESSAGES.NICKNAME_CHANGE_BLOCKED
    : nicknamePolicyQuery.data
      ? `남은 닉네임 변경 횟수 ${nicknamePolicyQuery.data.remainingNicknameChanges}회`
      : undefined;
  const bioValue = formValues.bio ?? meQuery.data?.bio ?? "";
  const snsUrlValue = formValues.snsUrl ?? meQuery.data?.snsUrl ?? "";
  const currentBio = meQuery.data?.bio ?? "";
  const currentSnsUrl = meQuery.data?.snsUrl ?? "";
  const hasProfileChanges =
    (!isNicknameChangeBlocked && nicknameValue.trim() !== currentNickname.trim()) ||
    bioValue.trim() !== currentBio.trim() ||
    snsUrlValue.trim() !== currentSnsUrl.trim() ||
    Boolean(formValues.profileImage);
  const profileMutation = useMutation({
    mutationFn: async () => {
      const nickname = nicknameValue.trim();
      const bio = bioValue.trim();
      const snsUrl = snsUrlValue.trim();
      const shouldUpdateNickname = !isNicknameChangeBlocked && nickname !== currentNickname.trim();
      const profileBody: UserProfileUpdateRequest = {
        bio,
        snsUrl: snsUrl || null,
        ...(shouldUpdateNickname ? { nickname } : {}),
      };

      if (shouldUpdateNickname) {
        const nicknameCheckResult = await checkNickname(nickname);

        if (!nicknameCheckResult.available) {
          throw new Error(PROFILE_VALIDATION_MESSAGES.NICKNAME_DUPLICATED);
        }
      }

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

        profileBody.profileImageUrl = uploadInfo.imageUrl;
      }

      return updateProfile(profileBody);
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
      router.replace("/mypage");
    },
    onError: error => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : PROFILE_VALIDATION_MESSAGES.PROFILE_UPDATE_FAILED;
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

    if (!isNicknameChangeBlocked) {
      if (!nickname) {
        nextErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_REQUIRED;
      } else if (nickname.length < 2) {
        nextErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_MIN_LENGTH;
      } else if (nickname.length > 10) {
        nextErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_MAX_LENGTH;
      }
    }

    if (bioValue.length > 100) {
      nextErrors.bio = PROFILE_VALIDATION_MESSAGES.BIO_MAX_LENGTH;
    }

    if (!isValidUrl(snsUrlValue)) {
      nextErrors.snsUrl = PROFILE_VALIDATION_MESSAGES.SNS_URL_INVALID;
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
    meQuery.isError ||
    (nicknamePolicyQuery.isError && !isNicknameLimitExceeded) ||
    !hasProfileChanges;

  if (!canFetchProfile) return null;

  return (
    <main className="bg-bg-primary min-h-dvh overflow-hidden">
      <Header title="회원정보 변경" showBack />

      <section className="fixed top-15 right-0 bottom-[82px] left-0 overflow-y-auto">
        <div className="mobile:w-97.5 mx-auto flex w-full flex-col gap-6 px-5 py-6">
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
              description={nicknameDescription}
              required={!isNicknameChangeBlocked}
              disabled={isNicknameChangeBlocked}
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
