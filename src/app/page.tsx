"use client";

import { useState } from "react";

import Image from "next/image";

import Tabs from "@/components/common/Tab";
import ArtTab from "@/components/home/ArtTab";
import RecommendTab from "@/components/home/RecommendTab";
import SpaceTab from "@/components/home/SpaceTab";
import {
  useArtworkFeed,
  useArtworkRecommendation,
  useSpaceFeed,
  useSpaceRecommendation,
} from "@/hooks/usePublicFeeds";
import type { ArtworkFeedItem, FeedCardItem, SpaceFeedItem } from "@/types/feed";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useMyRole } from "@/hooks/useMyRole";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const tabs = [
  { label: "추천", value: "recommend" },
  { label: "작품", value: "artwork" },
  { label: "공간", value: "space" },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "피드를 불러오지 못했습니다.";
}

function toArtworkCard(item: ArtworkFeedItem): FeedCardItem {
  return {
    id: `artwork-${item.id}`,
    title: item.title,
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
    author: item.ownerNickname,
    type: item.artworkType,
    href: `/art/${item.id}`,
  };
}

function toSpaceCard(item: SpaceFeedItem): FeedCardItem {
  return {
    id: `space-${item.id}`,
    title: item.title,
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
    author: item.ownerNickname,
    type: "공간",
    href: `/space/${item.id}`,
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("recommend");
  const router = useRouter();

  const artworkRecommendationQuery = useArtworkRecommendation(8);
  const spaceRecommendationQuery = useSpaceRecommendation(8);
  const artworkFeedQuery = useArtworkFeed(20);
  const spaceFeedQuery = useSpaceFeed(20);
  const { role, isLoggedIn } = useMyRole();

  const recommendedArtworks = (artworkRecommendationQuery.data?.items ?? []).map(toArtworkCard);
  const recommendedSpaces = (spaceRecommendationQuery.data?.items ?? []).map(toSpaceCard);
  const artworkFeed = (artworkFeedQuery.data?.pages ?? [])
    .flatMap(page => page.items)
    .map(toArtworkCard);
  const spaceFeed = (spaceFeedQuery.data?.pages ?? []).flatMap(page => page.items).map(toSpaceCard);

  const handleRegisterClick = () => {
    if (role === "CREATOR") {
      router.push("/art/new");
    } else {
      router.push("/space/new");
    }
  };
  return (
    <div className="pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="px-5 py-4">
        <div className="text-headline-1 text-text-primary h-14 font-semibold">홈</div>
      </div>
      {/* 배너 */}
      <section className="px-5">
        <div className="flex items-center justify-between">
          <div className="text-title-3 text-text-primary font-semibold">
            <div>지금 나에게 핏한</div>
            <div>전시 매칭</div>
          </div>
          <Image src="/home-icon.svg" alt="홈 아이콘" width={134} height={88} />
        </div>
      </section>
      {/* 탭 */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "recommend" && (
        <RecommendTab
          artData={recommendedArtworks}
          spaceData={recommendedSpaces}
          isArtLoading={artworkRecommendationQuery.isLoading}
          isSpaceLoading={spaceRecommendationQuery.isLoading}
          artErrorMessage={
            artworkRecommendationQuery.error
              ? getErrorMessage(artworkRecommendationQuery.error)
              : null
          }
          spaceErrorMessage={
            spaceRecommendationQuery.error ? getErrorMessage(spaceRecommendationQuery.error) : null
          }
          onRetryArt={() => void artworkRecommendationQuery.refetch()}
          onRetrySpace={() => void spaceRecommendationQuery.refetch()}
        />
      )}
      {activeTab === "artwork" && (
        <ArtTab
          artData={artworkFeed}
          isLoading={artworkFeedQuery.isLoading}
          errorMessage={artworkFeedQuery.error ? getErrorMessage(artworkFeedQuery.error) : null}
          hasMore={artworkFeedQuery.hasNextPage}
          isLoadingMore={artworkFeedQuery.isFetchingNextPage}
          onRetry={() => void artworkFeedQuery.refetch()}
          onLoadMore={() => void artworkFeedQuery.fetchNextPage()}
        />
      )}
      {activeTab === "space" && (
        <SpaceTab
          spaceData={spaceFeed}
          isLoading={spaceFeedQuery.isLoading}
          errorMessage={spaceFeedQuery.error ? getErrorMessage(spaceFeedQuery.error) : null}
          hasMore={spaceFeedQuery.hasNextPage}
          isLoadingMore={spaceFeedQuery.isFetchingNextPage}
          onRetry={() => void spaceFeedQuery.refetch()}
          onLoadMore={() => void spaceFeedQuery.fetchNextPage()}
        />
      )}
      {/* 작품/공간 등록 버튼 */}
      {isLoggedIn && (
        <button
          type="button"
          className="bg-object-primary fixed bottom-24 left-1/2 z-50 flex h-12.5 w-29 translate-x-20 items-center gap-1 rounded-full px-4 text-white"
          onClick={handleRegisterClick}
        >
          <Plus size={20} />
          <span className="text-body-1 font-medium">작품 등록</span>
        </button>
      )}
    </div>
  );
}
