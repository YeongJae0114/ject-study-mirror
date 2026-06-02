import React from "react";

import Image from "next/image";

import type { UserRole } from "@/types/auth";

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  iconSrc: string;
}

interface RoleSelectProps {
  selectedRole: UserRole | null;
  onRoleSelect: (roleId: UserRole) => void;
}

const roles: RoleOption[] = [
  {
    id: "SPACE_PARTNER",
    title: "공간 파트너",
    description: "전시 공간을 제공해요",
    iconSrc: "/space-icon.svg",
  },
  {
    id: "CREATOR",
    title: "크리에이터",
    description: "내 작품을 전시해요",
    iconSrc: "/create-icon.svg",
  },
];

export default function RoleSelect({ selectedRole, onRoleSelect }: RoleSelectProps) {
  return (
    <div className="space-y-4">
      {roles.map(role => (
        <button
          key={role.id}
          onClick={() => onRoleSelect(role.id)}
          className={`w-full rounded-lg border p-4 text-left transition-colors ${
            selectedRole === role.id
              ? "border-object-primary bg-object-primary-light"
              : "border-border-primary bg-bg-primary hover:border-object-primary"
          }`}
          type="button"
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex items-center justify-center rounded p-2 ${
                selectedRole === role.id ? "text-object-primary" : "text-text-secondary"
              }`}
            >
              <Image src={role.iconSrc} alt={role.title} width={50} height={50} />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-2 text-text-primary mb-1 font-semibold">{role.title}</h3>
              <p className="text-body-1 text-text-secondary">{role.description}</p>
            </div>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                selectedRole === role.id
                  ? "border-object-primary bg-object-primary"
                  : "border-border-primary"
              }`}
            >
              {selectedRole === role.id && <div className="bg-text-invert h-2 w-2 rounded-full" />}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
