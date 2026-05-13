"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/src/components/auth/AuthLayout";
import ProfileAvatarInput from "@/src/components/auth/ProfileAvatarInput";
import AuthTextField from "@/src/components/auth/AuthTextField";
import AuthButton from "@/src/components/auth/AuthButton";
import { useAuthSignupStore } from "@/src/stores/authSignupStore";

export default function ProfilePage() {
  const router = useRouter();
  // const [nickname, setNickname] = useState('');
  // const [bio, setBio] = useState('');
  // const [profileImage, setProfileImage] = useState<File | null>(null);

  const { nickname, bio, profileImage, setNickname, setBio, setProfileImage } =
    useAuthSignupStore();

  const [errors, setErrors] = useState<{ nickname?: string; bio?: string }>({});

  const validateForm = () => {
    const newErrors: { nickname?: string; bio?: string } = {};

    if (!nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (nickname.length < 2) {
      newErrors.nickname = "닉네임은 2자 이상 입력해주세요.";
    } else if (nickname.length > 10) {
      newErrors.nickname = "닉네임은 최대 10자까지 입력해주세요.";
    }

    if (bio.length > 100) {
      newErrors.bio = "자기소개는 최대 100자까지 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // TODO: 프로필 정보 저장 로직
      console.log("프로필 정보:", { nickname, bio, profileImage });
      router.push("/auth/signup/role");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isFormValid =
    nickname.trim().length >= 2 && nickname.length <= 10 && bio.length <= 100;

  return (
    <AuthLayout
      title="프로필 설정하기"
      description="기본 정보를 작성해주세요"
      variant="form"
      showBackButton
      onBack={handleBack}
    >
      <div className="space-y-3">
        <ProfileAvatarInput onImageChange={setProfileImage} />

        <AuthTextField
          label="닉네임 (최대 10자)"
          required
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={setNickname}
          error={errors.nickname}
          maxLength={10}
          showClearButton
        />

        <AuthTextField
          label="자기소개"
          placeholder="나를 소개해주세요."
          value={bio}
          onChange={setBio}
          error={errors.bio}
          type="textarea"
          maxLength={100}
        />

        <AuthButton onClick={handleNext} disabled={!isFormValid}>
          다음으로
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
