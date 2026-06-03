"use client";

import type { ReactNode } from "react";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showBorder?: boolean;
  right?: ReactNode;
}

export default function Header({ title, showBack = false, showBorder = true, right }: HeaderProps) {
  const router = useRouter();

  return (
    <>
      <header
        className={`bg-bg-primary fixed top-0 right-0 left-1/2 z-1 flex h-15 w-full max-w-97.5 -translate-x-1/2 items-center justify-between px-4 ${
          showBorder ? "border-border-primary border-b" : ""
        }`}
      >
        {/* Left */}
        <div className="flex w-6 items-center">
          {showBack && (
            <button
              aria-label="뒤로가기"
              onClick={() => router.back()}
              className="text-text-primary flex cursor-pointer items-center"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        {/* Title */}
        <div className="text-headline-1 text-text-primary flex-1 text-center font-semibold">
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
