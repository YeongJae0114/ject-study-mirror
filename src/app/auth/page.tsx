"use client";

import { useRouter } from "next/navigation";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthSocialButtons from "@/components/auth/AuthSocialButtons";
import { startOAuth } from "@/services/authApi";

export default function LoginPage() {
  const router = useRouter();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
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
        onGoogleLogin={() => startOAuth("google")}
        onNaverLogin={() => startOAuth("naver")}
      />
    </AuthLayout>
  );
}
