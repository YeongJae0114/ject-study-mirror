"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AuthButton from "@/components/auth/AuthButton";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTextField from "@/components/auth/AuthTextField";
import ProfileAvatarInput from "@/components/auth/ProfileAvatarInput";
import { PROFILE_VALIDATION_MESSAGES } from "@/constants/profile";
import { ApiError } from "@/services/apiClient";
import { checkNickname } from "@/services/userApi";
import { useAuthSignupStore } from "@/stores/authSignupStore";

export default function ProfilePage() {
  const router = useRouter();
  const { nickname, bio, profileImage, setNickname, setBio, setProfileImage } =
    useAuthSignupStore();

  const [errors, setErrors] = useState<{ nickname?: string; bio?: string; profileImage?: string }>(
    {}
  );
  const nicknameCheckMutation = useMutation({
    mutationFn: checkNickname,
    onSuccess: (data, checkedNickname) => {
      if (!data.available) {
        setErrors(prev => ({
          ...prev,
          nickname: PROFILE_VALIDATION_MESSAGES.NICKNAME_DUPLICATED,
        }));
        return;
      }

      setNickname(checkedNickname);
      router.push("/auth/signup/role");
    },
    onError: error => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : PROFILE_VALIDATION_MESSAGES.NICKNAME_CHECK_FAILED;
      setErrors(prev => ({ ...prev, nickname: message }));
    },
  });

  const validateForm = () => {
    const newErrors: { nickname?: string; bio?: string } = {};
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      newErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_REQUIRED;
    } else if (trimmedNickname.length < 2) {
      newErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_MIN_LENGTH;
    } else if (trimmedNickname.length > 10) {
      newErrors.nickname = PROFILE_VALIDATION_MESSAGES.NICKNAME_MAX_LENGTH;
    }

    if (bio.length > 100) {
      newErrors.bio = PROFILE_VALIDATION_MESSAGES.BIO_MAX_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    nicknameCheckMutation.mutate(nickname.trim());
  };

  const handleBack = () => {
    router.back();
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (errors.nickname) {
      setErrors(prev => ({ ...prev, nickname: undefined }));
    }
  };

  const handleBioChange = (value: string) => {
    setBio(value);
    if (errors.bio) {
      setErrors(prev => ({ ...prev, bio: undefined }));
    }
  };

  const handleProfileImageErrorChange = (message: string | null) => {
    setErrors(prev => ({ ...prev, profileImage: message ?? undefined }));
  };

  return (
    <AuthLayout
      title="프로필 설정하기"
      description="기본 정보를 작성해주세요"
      variant="form"
      showBackButton
      onBack={handleBack}
    >
      <div className="space-y-3">
        <ProfileAvatarInput
          file={profileImage}
          error={errors.profileImage}
          onImageChange={setProfileImage}
          onErrorChange={handleProfileImageErrorChange}
        />

        <AuthTextField
          label="닉네임 (최대 10자)"
          required
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          error={errors.nickname}
          showClearButton
        />

        <AuthTextField
          label="자기소개"
          placeholder="나를 소개해주세요."
          value={bio}
          onChange={handleBioChange}
          error={errors.bio}
          type="textarea"
          maxLength={100}
        />

        <AuthButton onClick={handleNext} disabled={nicknameCheckMutation.isPending}>
          {nicknameCheckMutation.isPending ? "확인 중" : "다음으로"}
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
