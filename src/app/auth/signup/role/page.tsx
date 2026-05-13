"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/src/components/auth/AuthLayout";
import RoleSelect from "@/src/components/auth/RoleSelect";
import AuthButton from "@/src/components/auth/AuthButton";
import { useAuthSignupStore } from "@/src/stores/authSignupStore";

export default function RolePage() {
  const router = useRouter();

  const { nickname, bio, profileImage, role, setRole } = useAuthSignupStore();

  // const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // const handleRoleSelect = (roleId: string) => {
  //   setSelectedRole(roleId);
  // };

  const handleComplete = () => {
    if (!role) return;

    console.log("회원가입 온보딩 데이터:", {
      nickname,
      bio,
      profileImage,
      role,
    });

    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthLayout
      title="역할 선택하기"
      description={
        "원하시는 역할을 선택해주세요\n역할에 따라 맞춤형 기능이 제공됩니다"
      }
      background="primary-darker"
      showBackButton
      onBack={handleBack}
      variant="form"
    >
      <div className="space-y-6">
        <RoleSelect selectedRole={role} onRoleSelect={setRole} />

        <AuthButton onClick={handleComplete} disabled={!role}>
          서비스 시작하기
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
