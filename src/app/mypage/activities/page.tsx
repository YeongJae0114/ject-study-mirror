"use client";

import { Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/common/Header";
import { useInfiniteExhibitions } from "@/hooks/useExhibitions";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function MypageActivitiesPage() {
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const query = useInfiniteExhibitions("CONFIRMED", 20);

  if (!isAuthReady || !isAuthenticated) return null;

  const activities = query.data?.pages.flatMap(page => page.items) ?? [];

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header title="활동 정보" showBack />

      <section className="px-5 py-6">
        {query.isLoading ? (
          <p className="text-body-2 text-text-secondary font-regular py-2">
            활동 정보를 불러오는 중입니다.
          </p>
        ) : query.error ? (
          <div className="py-2">
            <p className="text-body-2 text-error-default">
              {query.error instanceof Error
                ? query.error.message
                : "활동 정보를 불러오지 못했습니다."}
            </p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
            >
              다시 불러오기
            </button>
          </div>
        ) : activities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {activities.map((activity, index) => (
              <Link key={activity.id} href={`/exhibitions/${activity.id}`} className="block">
                <div className="flex items-center gap-4">
                  <div className="relative size-18.5 shrink-0 overflow-hidden rounded-lg">
                    {activity.thumbnailUrl ? (
                      <Image
                        src={normalizeImageUrl(activity.thumbnailUrl) ?? ""}
                        alt=""
                        fill
                        sizes="74px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-bg-primary-darker text-text-disabled flex size-full items-center justify-center">
                        <Images size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.45] font-medium">
                    <p className="text-body-1 text-text-primary truncate">{activity.title}</p>
                    <div className="text-body-2 text-text-secondary flex flex-col gap-[3px]">
                      <p>{`${formatDate(activity.startDate)}-${formatDate(activity.endDate)}`}</p>
                      <p>{activity.spaceName}</p>
                    </div>
                  </div>
                </div>

                {index < activities.length - 1 && (
                  <div className="border-border-primary mt-4 border-t" />
                )}
              </Link>
            ))}
            {query.hasNextPage && (
              <button
                type="button"
                onClick={() => void query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="border-border-primary text-body-1 text-text-primary mt-2 h-11 w-full rounded-lg border font-medium disabled:opacity-50"
              >
                {query.isFetchingNextPage ? "불러오는 중" : "더보기"}
              </button>
            )}
          </div>
        ) : (
          <p className="text-body-2 text-text-secondary font-regular py-2">
            등록된 활동 정보가 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
