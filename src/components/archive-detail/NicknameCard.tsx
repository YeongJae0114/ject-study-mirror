"use client";

import { ChevronRight } from "lucide-react";

interface NicknameCardProps {
  nickname: string;
  onClick?: () => void;
}

export default function NicknameCard({ nickname, onClick }: NicknameCardProps) {
  return (
    <div
      onClick={onClick}
      className="border-border-primary mt-2.5 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-center gap-3.5">
        <div className="bg-object-secondary-light flex h-10.5 w-10.5 items-center justify-center rounded-full"></div>
        <span className="text-body-2 text-text-primary font-medium">{nickname}</span>
      </div>
      <ChevronRight size={20} className="text-object-secondary" />
    </div>
  );
}
