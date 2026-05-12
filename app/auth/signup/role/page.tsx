'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import RoleSelect from '@/components/auth/RoleSelect';
import AuthButton from '@/components/auth/AuthButton';

export default function RolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleComplete = () => {
    if (selectedRole) {
      // TODO: 역할 선택 저장 및 회원가입 완료 로직
      console.log('선택된 역할:', selectedRole);
      // 회원가입 완료 후 메인 페이지로 이동
      router.push('/');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthLayout
      title="역할 선택하기"
      description={'원하시는 역할을 선택해주세요\n역할에 따라 맞춤형 기능이 제공됩니다'}
      background="primary-darker"
      showBackButton
      onBack={handleBack}
      variant="form"
    >
      <div className="space-y-6">
        <RoleSelect
          selectedRole={selectedRole}
          onRoleSelect={handleRoleSelect}
        />

        <AuthButton
          onClick={handleComplete}
          disabled={!selectedRole}
        >
          서비스 시작하기
        </AuthButton>
      </div>
    </AuthLayout>
  );
}