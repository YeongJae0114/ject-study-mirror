"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  /** 상대방 닉네임, null이면 기본 라벨 */
  title: string | null;
  /** ⋮ 메뉴 클릭 핸들러 (선택) */
  onMore?: () => void;
}

export default function ChatHeader({ title, onMore }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b-border-primary bg-bg-primary flex h-15 w-full min-w-[320px] items-center justify-between border-b px-4">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="text-text-primary flex w-6 cursor-pointer items-center"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="text-headline-1 text-text-primary flex-1 truncate px-2 text-center font-semibold">
        {title ?? "상대방"}
      </div>

      <button
        type="button"
        aria-label="더보기"
        onClick={onMore}
        className="text-text-primary flex w-6 cursor-pointer items-center justify-end"
      >
        <MoreVertical size={24} />
      </button>
    </header>
  );
}
