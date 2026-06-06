"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface NicknameCardProps {
  nickname: string;
  href: string;
  profileImageUrl?: string | null;
  fallbackLabel?: string;
}

export default function NicknameCard({
  nickname,
  href,
  profileImageUrl,
  fallbackLabel,
}: NicknameCardProps) {
  const displayImageUrl = normalizeImageUrl(profileImageUrl);

  return (
    <Link
      href={href}
      className="border-border-primary mt-2.5 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-center gap-3.5">
        <div className="bg-object-secondary-light text-caption text-text-primary-brand flex h-10.5 w-10.5 items-center justify-center overflow-hidden rounded-full font-medium">
          {displayImageUrl ? (
            <img src={displayImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            fallbackLabel
          )}
        </div>
        <span className="text-body-2 text-text-primary font-medium">{nickname}</span>
      </div>
      <ChevronRight size={20} className="text-object-secondary" />
    </Link>
  );
}
