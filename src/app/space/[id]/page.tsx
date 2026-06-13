"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import ExpandableText from "@/components/archive-detail/ExpandableText";
import ImageSwiper from "@/components/archive-detail/ImageSwiper";
import NicknameCard from "@/components/archive-detail/NicknameCard";
import SizeText from "@/components/archive-detail/SizeText";
import ArchiveTypeBadge from "@/components/common/ArchiveTypeBadge";
import BottomActionButton from "@/components/common/BottomActionButton";
import { useCreateChatRoom } from "@/hooks/useCreateChatRoom";
import { useMyRole } from "@/hooks/useMyRole";
import { ApiError } from "@/services/apiClient";
import { getMySpaceDetail, getSpaceDetail } from "@/services/spaces";
import { useAuthStore } from "@/stores/useAuthStore";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function hasText(value?: string | null) {
  return Boolean(value?.trim());
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "전시 문의를 시작하지 못했습니다.";
}

function isSpaceNotFound(error: unknown) {
  return error instanceof ApiError && error.code === "SPACE_NOT_FOUND";
}

export default function SpaceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const spaceId = params.id;
  const createChatRoom = useCreateChatRoom();
  const accessToken = useAuthStore(state => state.accessToken);
  const { role, isLoggedIn } = useMyRole();
  const [inquiryErrorMessage, setInquiryErrorMessage] = useState<string | null>(null);

  // 공간 전시 문의는 크리에이터(CREATOR)만 가능. 공간주끼리 문의 차단.
  // 비로그인 시에는 노출하고 클릭 시 로그인 페이지로 유도한다.
  const canInquire = !isLoggedIn || role === "CREATOR";

  const query = useQuery({
    queryKey: ["space-detail", spaceId, Boolean(accessToken)],
    queryFn: async ({ signal }) => {
      try {
        return await getSpaceDetail(spaceId, signal);
      } catch (error) {
        if (accessToken && isSpaceNotFound(error)) {
          return getMySpaceDetail(spaceId, signal);
        }
        throw error;
      }
    },
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
      <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-15 min-w-[320px]">
        <div className="mx-auto flex h-full w-full max-w-97.5 items-center px-4">
          <button
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="pointer-events-auto -ml-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
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
            {hasSpaceType && <ArchiveTypeBadge type={space.spaceType} />}
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

          {canInquire && (
            <BottomActionButton
              text="전시 문의하기"
              loadingText="이동 중..."
              isPending={createChatRoom.isPending}
              errorMessage={inquiryErrorMessage}
              onClick={handleInquiryClick}
            />
          )}
        </>
      )}
    </div>
  );
}
