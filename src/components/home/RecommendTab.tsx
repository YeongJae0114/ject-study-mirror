"use client";

import { ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import { useRouter } from "next/navigation";
import { EmptyContent } from "../common/EmptyContent";
import type { FeedCardItem } from "@/types/feed";

interface RecommendTabProps {
  artData: FeedCardItem[];
  spaceData: FeedCardItem[];
  isArtLoading?: boolean;
  isSpaceLoading?: boolean;
  artErrorMessage?: string | null;
  spaceErrorMessage?: string | null;
  onRetryArt?: () => void;
  onRetrySpace?: () => void;
}

function LoadingRow() {
  return (
    <div className="flex gap-2.5 overflow-hidden px-5 pb-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-42 shrink-0">
          <div className="bg-bg-primary-darker aspect-4/3 rounded-lg" />
          <div className="bg-bg-primary-darker mt-2 h-5 w-28 rounded" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="px-5 py-4">
      <p className="text-body-2 text-error-default">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
        >
          다시 불러오기
        </button>
      )}
    </div>
  );
}

export default function RecommendTab({
  artData,
  spaceData,
  isArtLoading = false,
  isSpaceLoading = false,
  artErrorMessage = null,
  spaceErrorMessage = null,
  onRetryArt,
  onRetrySpace,
}: RecommendTabProps) {
  const router = useRouter();
  return (
    <>
      {/* 추천 작품 */}
      <section className="mt-4">
        <div className="mb-4 flex items-center justify-between px-5">
          <h2 className="text-heading-2 font-semibold">이번 주 추천 작품</h2>
          {artData.length > 0 && (
            <button
              onClick={() => router.push("/recommend/art")}
              className="text-label text-text-secondary flex cursor-pointer items-center gap-0.5 font-medium"
            >
              전체보기
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {isArtLoading ? (
          <LoadingRow />
        ) : artErrorMessage ? (
          <ErrorState message={artErrorMessage} onRetry={onRetryArt} />
        ) : artData.length === 0 ? (
          <div className="pt-4">
            <EmptyContent />
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden">
            {artData.slice(0, 8).map(artwork => (
              <ContentCard
                key={artwork.id}
                title={artwork.title}
                imageUrl={artwork.imageUrl}
                href={artwork.href}
              />
            ))}
          </div>
        )}
      </section>

      {/* 추천 공간 */}
      <section className="mt-4">
        <div className="mb-4 flex items-center justify-between px-5">
          <h2 className="text-heading-2 font-semibold">이번 주 추천 공간</h2>
          {spaceData.length > 0 && (
            <button
              onClick={() => router.push("/recommend/space")}
              className="text-label text-text-secondary flex cursor-pointer items-center gap-0.5 font-medium"
            >
              전체보기
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {isSpaceLoading ? (
          <LoadingRow />
        ) : spaceErrorMessage ? (
          <ErrorState message={spaceErrorMessage} onRetry={onRetrySpace} />
        ) : spaceData.length === 0 ? (
          <div className="pt-4">
            <EmptyContent />
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden">
            {spaceData.slice(0, 8).map(space => (
              <ContentCard key={space.id} title={space.title} imageUrl={space.imageUrl} href={space.href} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
