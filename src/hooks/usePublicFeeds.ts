import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getArtworkFeed } from "@/services/artworks";
import { getSpaceFeed } from "@/services/spaces";
import type { ArtworkFeedItem, FeedPage, SpaceFeedItem } from "@/types/feed";

export function useArtworkRecommendation(size = 8) {
  return useQuery<FeedPage<ArtworkFeedItem>>({
    queryKey: ["public-feed", "artworks", "recommend", size],
    queryFn: ({ signal }) => getArtworkFeed({ size }, signal),
  });
}

export function useSpaceRecommendation(size = 8) {
  return useQuery<FeedPage<SpaceFeedItem>>({
    queryKey: ["public-feed", "spaces", "recommend", size],
    queryFn: ({ signal }) => getSpaceFeed({ size }, signal),
  });
}

export function useArtworkFeed(size = 20) {
  return useInfiniteQuery<FeedPage<ArtworkFeedItem>>({
    queryKey: ["public-feed", "artworks", size],
    queryFn: ({ pageParam }) => getArtworkFeed({ size, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}

export function useSpaceFeed(size = 20) {
  return useInfiniteQuery<FeedPage<SpaceFeedItem>>({
    queryKey: ["public-feed", "spaces", size],
    queryFn: ({ pageParam }) => getSpaceFeed({ size, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
