"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export default function Header({
  title,
  showBack = false,
  right,
}: HeaderProps) {
  const router = useRouter();

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-1
          mx-auto flex h-15 w-full max-w-[600px] min-w-[320px]
          items-center justify-between
          bg-bg-primary px-4 border-b border-b-border-primary
        "
      >
        {/* Left */}
        <div className="flex w-6 items-center">
          {showBack && (
            <button
              aria-label="뒤로가기"
              onClick={() => router.back()}
              className="flex cursor-pointer items-center"
            >
              ←
            </button>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 text-center text-headline-1 font-semibold text-coolNeutral-900">
          {title}
        </div>

        {/* Right */}
        <div className="flex w-6 items-center justify-end">{right}</div>
      </header>

      {/* Spacer */}
      <div className="h-15" />
    </>
  );
}
