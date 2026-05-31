"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export default function Header({ title, showBack = false, right }: HeaderProps) {
  const router = useRouter();

  return (
    <>
      <header className="bg-bg-primary border-b-border-primary fixed top-0 right-0 left-0 z-1 mx-auto flex h-15 w-full min-w-[320px] items-center justify-between border-b px-4">
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
        <div className="text-headline-1 text-coolNeutral-900 flex-1 text-center font-semibold">
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
