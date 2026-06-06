"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { EmptyContent } from "@/components/common/EmptyContent";
import Header from "@/components/common/Header";
import { ProfileFeedItem } from "@/components/profile/ProfileFeedItem";
import { getPublicProfileFeed } from "@/services/profileApi";
import type { ProfileFeedItem as ProfileFeedItemType, ProfileFeedResponse } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function toFeedItem(item: Omit<ProfileFeedItemType, "href">): ProfileFeedItemType {
  const basePath = item.targetType === "ARTWORK" ? "art" : "space";
  return {
    ...item,
    thumbnailUrl: normalizeImageUrl(item.thumbnailUrl),
    href: `/${basePath}/${item.id}`,
  };
}

export default function FeedInfoPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const canFetch = Number.isFinite(Number(userId));
  const feedQuery = useInfiniteQuery<ProfileFeedResponse>({
    queryKey: ["profile", userId, "feed", 20],
    queryFn: ({ pageParam, signal }) =>
      getPublicProfileFeed(userId, { page: pageParam as number, size: 20 }, signal),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: canFetch,
  });

  const feedItems = (feedQuery.data?.pages ?? []).flatMap(page => page.items).map(toFeedItem);

  return (
    <>
      <Header title="피드" showBack />
      <div className="px-5 pt-5">
        {feedQuery.isLoading ? (
          <p className="text-body-2 text-text-secondary py-2">피드를 불러오는 중입니다.</p>
        ) : feedQuery.isError ? (
          <p className="text-body-2 text-error-default py-2">피드를 불러오지 못했습니다.</p>
        ) : feedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {feedItems.map(item => (
                <ProfileFeedItem key={`${item.targetType}-${item.id}`} item={item} />
              ))}
            </div>
            {feedQuery.hasNextPage && (
              <button
                type="button"
                onClick={() => void feedQuery.fetchNextPage()}
                disabled={feedQuery.isFetchingNextPage}
                className="border-border-primary text-body-1 text-text-primary mt-6 h-11 w-full rounded-lg border font-medium disabled:opacity-50"
              >
                {feedQuery.isFetchingNextPage ? "불러오는 중" : "더보기"}
              </button>
            )}
          </>
        ) : (
          <div className="pt-10">
            <EmptyContent />
          </div>
        )}
      </div>
    </>
  );
}
