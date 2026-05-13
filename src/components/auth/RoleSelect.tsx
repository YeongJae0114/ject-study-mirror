import React from 'react';
import Image from 'next/image';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
}

interface RoleSelectProps {
  selectedRole: string | null;
  onRoleSelect: (roleId: string) => void;
}

const roles: RoleOption[] = [
  {
    id: 'partner',
    title: '공간 파트너',
    description: '전시 공간을 제공해요',
    iconSrc: '/space-icon.svg',
  },
  {
    id: 'creator',
    title: '크리에이터',
    description: '내 작품을 전시해요',
    iconSrc: '/create-icon.svg',
  },
];

export default function RoleSelect({ selectedRole, onRoleSelect }: RoleSelectProps) {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onRoleSelect(role.id)}
          className={`w-full p-4 border rounded-lg text-left transition-colors ${
            selectedRole === role.id
              ? 'border-object-primary bg-object-primary-light'
              : 'border-border-primary bg-bg-primary hover:border-object-primary'
          }`}
          type="button"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded flex items-center justify-center ${
              selectedRole === role.id ? 'text-object-primary' : 'text-text-secondary'
            }`}>
              <Image
                src={role.iconSrc}
                alt={role.title}
                width={50}
                height={50}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-2 font-semibold text-text-primary mb-1">
                {role.title}
              </h3>
              <p className="text-body-1 text-text-secondary">
                {role.description}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedRole === role.id
                ? 'border-object-primary bg-object-primary'
                : 'border-border-primary'
            }`}>
              {selectedRole === role.id && (
                <div className="w-2 h-2 bg-text-invert rounded-full" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}