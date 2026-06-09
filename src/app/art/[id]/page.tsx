"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import ExpandableText from "@/components/archive-detail/ExpandableText";
import ImageSwiper from "@/components/archive-detail/ImageSwiper";
import NicknameCard from "@/components/archive-detail/NicknameCard";
import RegionText from "@/components/archive-detail/RegionText";
import SizeText from "@/components/archive-detail/SizeText";
import { useCreateChatRoom } from "@/hooks/useCreateChatRoom";
import { getArtworkDetail } from "@/services/artworks";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useAuthStore } from "@/stores/useAuthStore";

function formatDate(date: string | null) {
  if (!date) return "-";
  return date.replaceAll("-", ".");
}

function hasText(value?: string | null) {
  return Boolean(value?.trim());
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "전시 문의를 시작하지 못했습니다.";
}

export default function ArtDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const artworkId = params.id;
  const createChatRoom = useCreateChatRoom();
  const accessToken = useAuthStore(state => state.accessToken);
  const [inquiryErrorMessage, setInquiryErrorMessage] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["artwork-detail", artworkId],
    queryFn: ({ signal }) => getArtworkDetail(artworkId, signal),
    enabled: Boolean(artworkId),
  });

  const artwork = query.data;
  const numericArtworkId = Number(artworkId);
  const artworkImages =
    artwork?.imageUrls?.flatMap(url => {
      const normalized = normalizeImageUrl(url);
      return normalized ? [normalized] : [];
    }) ?? [];
  const ownerNickname =
    artwork?.ownerNickname?.trim() || `크리에이터 ${artwork?.ownerId ?? ""}`.trim();
  const hasCreatedDate = Boolean(artwork?.createdDate);
  const hasDescription = hasText(artwork?.description);
  const hasCaution = hasText(artwork?.caution);

  const handleInquiryClick = () => {
    if (!Number.isFinite(numericArtworkId)) return;

    if (!accessToken) {
      router.push("/auth");
      return;
    }

    setInquiryErrorMessage(null);
    createChatRoom.mutate(
      { targetType: "ARTWORK", targetId: numericArtworkId },
      {
        onSuccess: room => router.push(`/chat/${room.id}`),
        onError: error => setInquiryErrorMessage(getErrorMessage(error)),
      }
    );
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="fixed top-0 right-0 left-0 z-50 flex h-15 w-full min-w-[320px] px-4">
        <div className="flex items-center">
          <button
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex cursor-pointer items-center font-bold text-white drop-shadow-md"
          >
            ←
          </button>
        </div>
      </header>

      {query.isLoading ? (
        <div className="flex min-h-screen items-center justify-center px-5 text-sm text-gray-500">
          불러오는 중...
        </div>
      ) : query.isError || !artwork ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
          <p className="text-body-2 text-text-secondary">작품 정보를 불러오지 못했습니다.</p>
          <button
            onClick={() => query.refetch()}
            className="border-border-primary text-body-2 rounded-lg border px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <ImageSwiper images={artworkImages} altPrefix="작품 이미지" />
          <div className="text-text-primary flex flex-col gap-1.5 px-5 py-6">
            <div className="text-caption bg-object-secondary-light h-6 w-fit min-w-14 rounded-sm px-1.5 py-1 font-medium">
              {artwork.artworkType}
            </div>
            <div className="text-title-3 font-semibold">{artwork.title}</div>

            <RegionText regions={artwork.availableRegions} />

            <NicknameCard
              href={`/profile/${artwork.ownerId}`}
              nickname={ownerNickname}
              profileImageUrl={artwork.ownerProfileImageUrl}
              fallbackLabel="C"
            />
          </div>

          <div className="bg-bg-primary-darker h-1" />

          <div className="text-text-primary flex flex-col gap-8 px-5 py-6">
            {hasCreatedDate && (
              <div className="text-text-primary flex flex-col gap-2">
                <div className="text-heading-2 font-medium">작품 제작일</div>
                <p className="text-body-2 font-regular">{formatDate(artwork.createdDate)}</p>
              </div>
            )}

            <SizeText
              title="필요한 전시 공간 사이즈"
              width={artwork.widthCm ?? undefined}
              height={artwork.heightCm ?? undefined}
              depth={artwork.depthCm ?? undefined}
            />

            {hasDescription && (
              <ExpandableText
                title="작품 상세"
                content={artwork.description!.trim()}
                maxLines={4}
              />
            )}

            {hasCaution && (
              <ExpandableText title="주의사항" content={artwork.caution!.trim()} maxLines={4} />
            )}
          </div>

          <div className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-50 border-t px-5 pt-3 pb-9">
            {inquiryErrorMessage && (
              <p
                role="alert"
                className="text-caption text-error-default mx-auto mb-2 max-w-[430px]"
              >
                {inquiryErrorMessage}
              </p>
            )}
            <button
              onClick={handleInquiryClick}
              disabled={createChatRoom.isPending}
              className="bg-object-primary text-body-1 text-text-invert flex h-12.5 w-full items-center justify-center rounded-lg font-medium disabled:opacity-50"
            >
              {createChatRoom.isPending ? "이동 중..." : "전시 문의하기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
