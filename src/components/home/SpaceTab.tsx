import ContentCard from "./ContentCard";
import SortDropdown from "./SortDropdown";
import { EmptyContent } from "../common/EmptyContent";
import type { FeedCardItem } from "@/types/feed";

interface SpaceTabProps {
  spaceData: FeedCardItem[];
  isLoading?: boolean;
  errorMessage?: string | null;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onRetry?: () => void;
  onLoadMore?: () => void;
}

function FeedSkeleton() {
  return (
    <div className="mx-auto grid max-w-100 grid-cols-2 gap-x-3.5 gap-y-3.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-full">
          <div className="bg-bg-primary-darker aspect-4/3 rounded-lg" />
          <div className="bg-bg-primary-darker mt-2 h-5 w-24 rounded" />
          <div className="bg-bg-primary-darker mt-1 h-4 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function SpaceTab({
  spaceData,
  isLoading = false,
  errorMessage = null,
  hasMore = false,
  isLoadingMore = false,
  onRetry,
  onLoadMore,
}: SpaceTabProps) {
  return (
    <main className="px-5 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-heading-2 font-semibold">공간 리스트</div>
        {/* UI만 구현. 추후에 함수 추가 */}
        {spaceData.length > 0 && <SortDropdown />}
      </div>
      {isLoading ? (
        <FeedSkeleton />
      ) : errorMessage ? (
        <div className="py-6">
          <p className="text-body-2 text-error-default">{errorMessage}</p>
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
      ) : spaceData.length === 0 ? (
        <div className="pt-4">
          <EmptyContent />
        </div>
      ) : (
        <>
          <div className="mx-auto grid max-w-100 grid-cols-2 gap-x-3.5 gap-y-3.5">
            {spaceData.map(space => (
              <div key={space.id} className="w-full">
                <ContentCard
                  title={space.title}
                  imageUrl={space.imageUrl}
                  author={space.author}
                  type={space.type}
                  href={space.href}
                />
              </div>
            ))}
          </div>
          {hasMore && onLoadMore && (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="border-border-primary text-body-1 text-text-primary mt-6 h-11 w-full rounded-lg border font-medium disabled:opacity-50"
            >
              {isLoadingMore ? "불러오는 중" : "더보기"}
            </button>
          )}
        </>
      )}
    </main>
  );
}
