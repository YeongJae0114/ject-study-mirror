"use client";

import { useEffect, useState } from "react";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Images, MoreVertical, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ConfirmModal from "@/components/mypage/ConfirmModal";
import Toast from "@/components/mypage/Toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { deleteArtwork } from "@/services/artworks";
import { getMe } from "@/services/authApi";
import { getMypageFeed } from "@/services/mypageApi";
import { deleteSpace } from "@/services/spaces";
import type { MypageArtwork, MypageFeedApiItem, MypageFeedResponse } from "@/types/mypage";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function toMypageFeedItem(item: MypageFeedApiItem): MypageArtwork {
  const basePath = item.targetType === "ARTWORK" ? "art" : "space";
  return {
    id: `${item.targetType.toLowerCase()}-${item.id}`,
    targetId: item.id,
    targetType: item.targetType,
    imageUrl: normalizeImageUrl(item.thumbnailUrl),
    title: item.title,
    type: item.type,
    statusLabel: item.isPublic ? "공개" : "비공개",
    isPrivate: !item.isPublic,
    href: `/${basePath}/${item.id}`,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
}

function FeedCard({
  item,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: {
  item: MypageArtwork;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="relative flex h-55.5 min-w-0 flex-col">
      <div className="relative">
        <Link href={item.href} className="block min-w-0">
          <div className="border-border-primary relative h-33.5 overflow-hidden rounded-lg border">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                fill
                sizes="168px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="bg-bg-primary-darker text-text-disabled flex size-full items-center justify-center">
                <Images size={28} />
              </div>
            )}

            {item.isPrivate && (
              <>
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[rgba(26,26,30,0.5)] to-transparent" />
                <Image
                  src="/icon-private-lock.svg"
                  alt=""
                  width={14}
                  height={18}
                  className="absolute top-3 left-3"
                />
              </>
            )}
          </div>
        </Link>

        <button
          type="button"
          aria-label="피드 메뉴"
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            onMenuToggle();
          }}
          className="text-text-invert absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
        >
          <MoreVertical size={22} strokeWidth={2.4} />
        </button>

        {menuOpen && (
          <div className="shadow-spread-low absolute top-10 right-2 z-20 w-22 overflow-hidden rounded-lg bg-white">
            <button
              type="button"
              onClick={onEdit}
              className="text-body-2 text-text-primary hover:bg-object-primary-light hover:text-text-primary-brand focus-visible:bg-object-primary-light focus-visible:text-text-primary-brand active:bg-object-primary-light h-10 w-full cursor-pointer px-4 text-left font-medium transition-colors outline-none"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="text-body-2 text-text-primary hover:bg-error-light hover:text-error-default focus-visible:bg-error-light focus-visible:text-error-default active:bg-error-light h-10 w-full cursor-pointer px-4 text-left font-medium transition-colors outline-none"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <Link href={item.href} className="block min-w-0">
        <div className="flex w-full flex-col items-start gap-1 pt-2 pr-3.5 pb-3 pl-1">
          <span className="bg-object-primary-light text-text-primary-brand text-caption inline-flex h-5 items-center justify-center rounded px-1.5 py-0.5 font-medium">
            {item.statusLabel}
          </span>
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-body-1 text-text-primary truncate font-semibold">{item.title}</p>
            <p className="text-label text-text-secondary font-regular truncate">{item.type}</p>
          </div>
        </div>
      </Link>

    </article>
  );
}

export default function MypageFeedPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MypageArtwork | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const canFetchMe = isAuthReady && isAuthenticated;
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: canFetchMe,
  });
  const deleteMutation = useMutation({
    mutationFn: (item: MypageArtwork) =>
      item.targetType === "ARTWORK" ? deleteArtwork(item.targetId) : deleteSpace(item.targetId),
    onSuccess: () => {
      setDeleteTarget(null);
      setOpenMenuId(null);
      setToastMessage("삭제되었습니다.");
      setToastOpen(true);
      void queryClient.invalidateQueries({ queryKey: ["mypage", "feed"] });
    },
  });
  const feedQuery = useInfiniteQuery<MypageFeedResponse>({
    queryKey: ["mypage", "feed", 20],
    queryFn: ({ pageParam }) => getMypageFeed({ page: pageParam as number, size: 20 }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: canFetchMe,
  });

  useEffect(() => {
    if (!toastOpen) return;

    const timer = window.setTimeout(() => {
      setToastOpen(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [toastOpen]);

  if (!isAuthReady || !isAuthenticated) return null;

  const feedItems = (feedQuery.data?.pages ?? []).flatMap(page => page.items).map(toMypageFeedItem);

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

  const handleEditClick = (item: MypageArtwork) => {
    setOpenMenuId(null);
    const path =
      item.targetType === "ARTWORK" ? `/art/${item.targetId}/edit` : `/space/${item.targetId}/edit`;
    router.push(path);
  };

  const handleDeleteClick = (item: MypageArtwork) => {
    deleteMutation.reset();
    setOpenMenuId(null);
    setDeleteTarget(item);
  };

  const closeDeleteModal = () => {
    if (deleteMutation.isPending) return;
    setDeleteTarget(null);
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
          <p className="text-body-2 text-text-secondary font-regular py-2">
            피드를 불러오는 중입니다.
          </p>
        ) : feedQuery.error ? (
          <div className="py-2">
            <p className="text-body-2 text-error-default">
              {feedQuery.error instanceof Error
                ? feedQuery.error.message
                : "피드를 불러오지 못했습니다."}
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
                <FeedCard
                  key={item.id}
                  item={item}
                  menuOpen={openMenuId === item.id}
                  onMenuToggle={() => setOpenMenuId(prev => (prev === item.id ? null : item.id))}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() => handleDeleteClick(item)}
                />
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
          <p className="text-body-2 text-text-secondary font-regular py-2">
            등록된 피드가 없습니다.
          </p>
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="피드를 삭제할까요?"
        description="삭제한 작품/공간은 되돌릴 수 없습니다."
        confirmText="삭제"
        tone="danger"
        isConfirmLoading={deleteMutation.isPending}
        errorMessage={deleteMutation.error ? getErrorMessage(deleteMutation.error) : null}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget);
        }}
      />
      <Toast open={toastOpen} message={toastMessage} />
    </main>
  );
}
