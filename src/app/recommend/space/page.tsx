"use client";

import { EmptyContent } from "@/components/common/EmptyContent";
import Header from "@/components/common/Header";
import ContentCard from "@/components/home/ContentCard";
import { useSpaceFeed } from "@/hooks/usePublicFeeds";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "추천 공간을 불러오지 못했습니다.";
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
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

export default function RecommendSpacePage() {
  const query = useSpaceFeed(20);
  const spaces = (query.data?.pages ?? []).flatMap(page => page.items);
  const errorMessage = query.error ? getErrorMessage(query.error) : null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-10">
      <Header title="추천 공간" showBack showBorder={false} />

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
        ) : spaces.length === 0 ? (
          <div className="pt-10">
            <EmptyContent />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {spaces.map(space => (
                <div key={space.id} className="w-full">
                  <ContentCard
                    title={space.title}
                    imageUrl={normalizeImageUrl(space.thumbnailUrl)}
                    author={space.ownerNickname}
                    type="공간"
                    href={`/space/${space.id}`}
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
