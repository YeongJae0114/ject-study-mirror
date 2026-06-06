"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { EmptyContent } from "@/components/common/EmptyContent";
import Header from "@/components/common/Header";
import { ProfileActivityItem } from "@/components/profile/ProfileActivityItem";
import { getPublicProfileActivities } from "@/services/profileApi";
import type { Activity, ProfileActivityResponse } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function toActivity(item: Omit<Activity, "period" | "location" | "imageUrl">): Activity {
  return {
    ...item,
    period: `${formatDate(item.startDate)}-${formatDate(item.endDate)}`,
    location: item.spaceName ?? "",
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
  };
}

export default function ActivityInfoPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const canFetch = Number.isFinite(Number(userId));
  const activityQuery = useInfiniteQuery<ProfileActivityResponse>({
    queryKey: ["profile", userId, "activities", 20],
    queryFn: ({ pageParam, signal }) =>
      getPublicProfileActivities(userId, { page: pageParam as number, size: 20 }, signal),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: canFetch,
  });

  const activities = (activityQuery.data?.pages ?? []).flatMap(page => page.items).map(toActivity);

  return (
    <>
      <Header title="활동 정보" showBack />
      <div className="px-5 pt-4">
        {activityQuery.isLoading ? (
          <p className="text-body-2 text-text-secondary py-2">활동 정보를 불러오는 중입니다.</p>
        ) : activityQuery.isError ? (
          <p className="text-body-2 text-error-default py-2">활동 정보를 불러오지 못했습니다.</p>
        ) : activities.length > 0 ? (
          <>
            {activities.map(activity => (
              <ProfileActivityItem key={activity.id} activity={activity} />
            ))}
            {activityQuery.hasNextPage && (
              <button
                type="button"
                onClick={() => void activityQuery.fetchNextPage()}
                disabled={activityQuery.isFetchingNextPage}
                className="border-border-primary text-body-1 text-text-primary mt-6 h-11 w-full rounded-lg border font-medium disabled:opacity-50"
              >
                {activityQuery.isFetchingNextPage ? "불러오는 중" : "더보기"}
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
