"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import ExpandableText from "@/components/archive-detail/ExpandableText";
import ImageSwiper from "@/components/archive-detail/ImageSwiper";
import NicknameCard from "@/components/archive-detail/NicknameCard";
import SizeText from "@/components/archive-detail/SizeText";
import { useCreateChatRoom } from "@/hooks/useCreateChatRoom";
import { getSpaceDetail } from "@/services/spaces";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useAuthStore } from "@/stores/useAuthStore";

function hasText(value?: string | null) {
  return Boolean(value?.trim());
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "전시 문의를 시작하지 못했습니다.";
}

export default function SpaceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const spaceId = params.id;
  const createChatRoom = useCreateChatRoom();
  const accessToken = useAuthStore(state => state.accessToken);
  const [inquiryErrorMessage, setInquiryErrorMessage] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["space-detail", spaceId],
    queryFn: ({ signal }) => getSpaceDetail(spaceId, signal),
    enabled: Boolean(spaceId),
  });

  const space = query.data;
  const numericSpaceId = Number(spaceId);
  const spaceImages =
    space?.imageUrls?.flatMap(url => {
      const normalized = normalizeImageUrl(url);
      return normalized ? [normalized] : [];
    }) ?? [];
  const ownerNickname =
    space?.ownerNickname?.trim() || `공간 파트너 ${space?.ownerId ?? ""}`.trim();
  const hasSpaceType = hasText(space?.spaceType);
  const hasAddress = hasText(space?.address);
  const hasDescription = hasText(space?.description);
  const hasCaution = hasText(space?.caution);

  const handleInquiryClick = () => {
    if (!Number.isFinite(numericSpaceId)) return;

    if (!accessToken) {
      router.push("/auth");
      return;
    }

    setInquiryErrorMessage(null);
    createChatRoom.mutate(
      { targetType: "SPACE", targetId: numericSpaceId },
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
      ) : query.isError || !space ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
          <p className="text-body-2 text-text-secondary">공간 정보를 불러오지 못했습니다.</p>
          <button
            onClick={() => query.refetch()}
            className="border-border-primary text-body-2 rounded-lg border px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <ImageSwiper images={spaceImages} altPrefix="공간 이미지" />

          <div className="text-text-primary flex flex-col gap-1.5 px-5 py-6">
            {hasSpaceType && (
              <div className="text-caption bg-object-secondary-light h-6 w-fit min-w-14 rounded-sm px-1.5 py-1 font-medium">
                {space.spaceType}
              </div>
            )}
            <div className="text-title-3 font-semibold">{space.title}</div>

            {hasAddress && (
              <div className="flex flex-col gap-1 py-2">
                <div className="text-label font-semibold">주소</div>
                <div className="text-body-2 font-regular">{space.address}</div>
              </div>
            )}

            <NicknameCard
              href={`/profile/${space.ownerId}`}
              nickname={ownerNickname}
              profileImageUrl={space.ownerProfileImageUrl}
              fallbackLabel="S"
            />
          </div>

          <div className="bg-bg-primary-darker h-1" />

          <div className="text-text-primary flex flex-col gap-8 px-5 py-6">
            <SizeText
              title="제공 가능한 공간 사이즈"
              width={space.widthCm ?? undefined}
              height={space.heightCm ?? undefined}
              depth={space.depthCm ?? undefined}
            />

            {hasDescription && (
              <ExpandableText title="공간 상세" content={space.description!.trim()} maxLines={4} />
            )}

            {hasCaution && (
              <ExpandableText title="주의사항" content={space.caution!.trim()} maxLines={4} />
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
