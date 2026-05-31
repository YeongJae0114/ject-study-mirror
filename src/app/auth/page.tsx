"use client";

import { useRouter } from "next/navigation";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthSocialButtons from "@/components/auth/AuthSocialButtons";

export default function LoginPage() {
  const router = useRouter();

  const handleSocialLogin = () => {
    // TODO: 소셜 로그인 로직 구현
    // 로그인 성공 시 프로필 설정으로 이동
    router.push("/auth/signup/profile");
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <AuthLayout
      title="ReFit"
      description="전시의 가치를 다시 입히다"
      variant="brand"
      showCloseButton
      onClose={handleClose}
      showLogo
    >
      <AuthSocialButtons
        onGoogleLogin={handleSocialLogin}
        onNaverLogin={handleSocialLogin}
        onKakaoLogin={handleSocialLogin}
      />
    </AuthLayout>
  );
}
