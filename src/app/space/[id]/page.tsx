"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import ExpandableText from "@/components/archive-detail/ExpandableText";
import ImageSwiper from "@/components/archive-detail/ImageSwiper";
import NicknameCard from "@/components/archive-detail/NicknameCard";
import { getSpaceDetail } from "@/services/spaces";

export default function SpaceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const spaceId = params.id;

  const query = useQuery({
    queryKey: ["space-detail", spaceId],
    queryFn: ({ signal }) => getSpaceDetail(spaceId, signal),
    enabled: Boolean(spaceId),
  });

  const space = query.data;
  const spaceImages = space?.imageUrls?.filter(Boolean) ?? [];

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
            <div className="text-caption bg-object-secondary-light h-6 w-fit min-w-14 rounded-sm px-1.5 py-1 font-medium">
              공간
            </div>
            <div className="text-title-3 font-semibold">{space.title}</div>

            <NicknameCard nickname={`공간 제공자 ${space.ownerId}`} />
          </div>

          <div className="bg-bg-primary-darker h-1" />

          <div className="text-text-primary flex flex-col gap-8 px-5 py-6">
            <ExpandableText
              title="공간 상세"
              content={space.description?.trim() || "등록된 공간 상세 설명이 없습니다."}
              maxLines={4}
            />
          </div>

          <div className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-50 border-t px-5 pt-3 pb-9">
            <button
              onClick={() => alert("전시 문의 프로세스 시작")}
              className="bg-object-primary text-body-1 text-text-invert flex h-12.5 w-full items-center justify-center rounded-lg font-medium"
            >
              전시 문의하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
