"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import Header from "@/components/common/Header";
import { ProfileActivityList } from "@/components/profile/ProfileActivityList";
import { ProfileFeedList } from "@/components/profile/ProfileFeedList";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import {
  getPublicProfile,
  getPublicProfileActivities,
  getPublicProfileFeed,
} from "@/services/profileApi";
import type { Activity, ProfileFeedItem } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function formatPeriod(startDate: string, endDate: string) {
  return `${formatDate(startDate)}-${formatDate(endDate)}`;
}

function toFeedItem(item: Omit<ProfileFeedItem, "href">): ProfileFeedItem {
  const basePath = item.targetType === "ARTWORK" ? "art" : "space";
  return {
    ...item,
    thumbnailUrl: normalizeImageUrl(item.thumbnailUrl),
    href: `/${basePath}/${item.id}`,
  };
}

function toActivity(item: Omit<Activity, "period" | "location" | "imageUrl">): Activity {
  return {
    ...item,
    period: formatPeriod(item.startDate, item.endDate),
    location: item.spaceName ?? "",
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
  };
}

// 크리에이터, 공간주 프로필 형식은 똑같음
export default function CreatorProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const numericUserId = Number(userId);
  const canFetch = Number.isFinite(numericUserId);

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: ({ signal }) => getPublicProfile(userId, signal),
    enabled: canFetch,
  });
  const feedQuery = useQuery({
    queryKey: ["profile", userId, "feed", 0, 4],
    queryFn: ({ signal }) => getPublicProfileFeed(userId, { page: 0, size: 4 }, signal),
    enabled: canFetch,
  });
  const activityQuery = useQuery({
    queryKey: ["profile", userId, "activities", 0, 4],
    queryFn: ({ signal }) => getPublicProfileActivities(userId, { page: 0, size: 4 }, signal),
    enabled: canFetch,
  });

  const profile = profileQuery.data;
  const feedItems = (feedQuery.data?.items ?? []).map(toFeedItem);
  const activities = (activityQuery.data?.items ?? []).map(toActivity);
  const isLoading = profileQuery.isLoading || feedQuery.isLoading || activityQuery.isLoading;
  const isError = profileQuery.isError || feedQuery.isError || activityQuery.isError;

  return (
    <>
      <Header title="프로필" showBack />
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          불러오는 중...
        </div>
      ) : isError || !profile ? (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          프로필 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <div>
          <ProfileHeader
            avatarUrl={profile.profileImageUrl}
            name={profile.nickname ?? "프로필"}
            role={profile.roleLabel}
          />
          <div className="bg-bg-primary-darker my-6 h-1"></div>
          <div className="mb-9 flex flex-col gap-11 px-5">
            <ProfileInfo bio={profile.bio} snsLink={profile.snsUrl} />
            <ProfileActivityList
              userId={numericUserId}
              activities={activities}
              hasMore={Boolean(activityQuery.data?.hasNext)}
            />
            <ProfileFeedList
              userId={numericUserId}
              items={feedItems}
              hasMore={Boolean(feedQuery.data?.hasNext)}
            />
          </div>
        </div>
      )}
    </>
  );
}
