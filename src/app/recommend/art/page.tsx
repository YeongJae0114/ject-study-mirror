"use client";

import { EmptyContent } from "@/components/common/EmptyContent";
import Header from "@/components/common/Header";
import ContentCard from "@/components/home/ContentCard";
import { useArtworkFeed } from "@/hooks/usePublicFeeds";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "추천 작품을 불러오지 못했습니다.";
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-3.5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-full">
          <div className="bg-bg-primary-darker aspect-4/3 rounded-lg" />
          <div className="bg-bg-primary-darker mt-2 h-5 w-24 rounded" />
          <div className="bg-bg-primary-darker mt-1 h-4 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function RecommendArtPage() {
  const query = useArtworkFeed(20);
  const artworks = (query.data?.pages ?? []).flatMap(page => page.items);
  const errorMessage = query.error ? getErrorMessage(query.error) : null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-10">
      <Header title="추천 작품" showBack showBorder={false} />

      <main className="px-5 pt-5">
        {query.isLoading ? (
          <GridSkeleton />
        ) : errorMessage ? (
          <div className="py-6">
            <p className="text-body-2 text-error-default">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
            >
              다시 불러오기
            </button>
          </div>
        ) : artworks.length === 0 ? (
          <div className="pt-10">
            <EmptyContent />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3.5">
              {artworks.map(artwork => (
                <div key={artwork.id} className="w-full">
                  <ContentCard
                    title={artwork.title}
                    imageUrl={normalizeImageUrl(artwork.thumbnailUrl)}
                    author={artwork.ownerNickname}
                    type={artwork.artworkType}
                    href={`/art/${artwork.id}`}
                  />
                </div>
              ))}
            </div>
            {query.hasNextPage && (
              <button
                type="button"
                onClick={() => void query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="border-border-primary text-body-1 text-text-primary mt-6 h-11 w-full rounded-lg border font-medium disabled:opacity-50"
              >
                {query.isFetchingNextPage ? "불러오는 중" : "더보기"}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
