"use client";

import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Images, LockKeyhole, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getMe } from "@/services/authApi";
import { getMypageFeed } from "@/services/mypageApi";
import type { MypageArtwork, MypageFeedApiItem, MypageFeedResponse } from "@/types/mypage";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function toMypageFeedItem(item: MypageFeedApiItem): MypageArtwork {
  const basePath = item.targetType === "ARTWORK" ? "art" : "space";
  return {
    id: `${item.targetType.toLowerCase()}-${item.id}`,
    targetType: item.targetType,
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
    title: item.title,
    type: item.type,
    statusLabel: item.isPublic ? "공개" : "비공개",
    isPrivate: !item.isPublic,
    href: `/${basePath}/${item.id}`,
  };
}

function FeedCard({ item }: { item: MypageArtwork }) {
  return (
    <Link href={item.href} className="block min-w-0">
      <article className="flex h-55.5 min-w-0 flex-col">
        <div className="border-border-primary relative h-33.5 overflow-hidden rounded-lg border">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" fill sizes="168px" className="object-cover" />
          ) : (
            <div className="bg-bg-primary-darker text-text-disabled flex size-full items-center justify-center">
              <Images size={28} />
            </div>
          )}

          {item.isPrivate && (
            <>
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[rgba(26,26,30,0.5)] to-transparent" />
              <LockKeyhole
                size={20}
                className="text-text-invert absolute top-3 left-3"
                strokeWidth={2.2}
              />
            </>
          )}
        </div>

        <div className="flex w-full flex-col items-start gap-1 pt-2 pr-3.5 pb-3 pl-1">
          <span className="bg-object-primary-light text-text-primary-brand text-caption inline-flex h-5 items-center justify-center rounded px-1.5 py-0.5 font-medium">
            {item.statusLabel}
          </span>
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-body-1 text-text-primary truncate font-semibold">{item.title}</p>
            <p className="text-label text-text-secondary font-regular truncate">{item.type}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function MypageFeedPage() {
  const router = useRouter();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetchMe = isAuthReady && isAuthenticated;
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchMe,
  });
  const feedQuery = useInfiniteQuery<MypageFeedResponse>({
    queryKey: ["mypage", "feed", 20],
    queryFn: ({ pageParam }) => getMypageFeed({ page: pageParam as number, size: 20 }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: canFetchMe,
  });

  if (!isAuthReady || !isAuthenticated) return null;

  const feedItems = (feedQuery.data?.pages ?? [])
    .flatMap(page => page.items)
    .map(toMypageFeedItem);

  const handleCreateClick = () => {
    if (meQuery.data?.role === "CREATOR") {
      router.push("/art/new");
      return;
    }

    if (meQuery.data?.role === "SPACE_PARTNER") {
      router.push("/space/new");
      return;
    }

    router.push("/auth/signup/profile");
  };

  return (
    <main className="bg-bg-primary min-h-dvh">
      <Header
        title="피드"
        showBack
        right={
          <button
            type="button"
            aria-label="피드 등록"
            onClick={handleCreateClick}
            disabled={meQuery.isLoading}
            className="text-object-primary flex size-6 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        }
      />

      <section className="px-5 py-6">
        {feedQuery.isLoading ? (
          <p className="text-body-2 text-text-secondary font-regular py-2">피드를 불러오는 중입니다.</p>
        ) : feedQuery.error ? (
          <div className="py-2">
            <p className="text-body-2 text-error-default">
              {feedQuery.error instanceof Error ? feedQuery.error.message : "피드를 불러오지 못했습니다."}
            </p>
            <button
              type="button"
              onClick={() => void feedQuery.refetch()}
              className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
            >
              다시 불러오기
            </button>
          </div>
        ) : feedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3.5">
              {feedItems.map(item => (
                <FeedCard key={item.id} item={item} />
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
          <p className="text-body-2 text-text-secondary font-regular py-2">등록된 피드가 없습니다.</p>
        )}
      </section>
    </main>
  );
}
