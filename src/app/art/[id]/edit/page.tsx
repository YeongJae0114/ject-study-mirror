"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import DatePicker from "@/components/archive-form/DayPicker";
import Dropdown from "@/components/archive-form/Dropdown";
import Input from "@/components/archive-form/Input";
import Label from "@/components/archive-form/Label";
import RegionSelect from "@/components/archive-form/RegionSelect";
import SizeInput from "@/components/archive-form/SizeInput";
import Textarea from "@/components/archive-form/Textarea";
import ToggleButton from "@/components/archive-form/ToggleButton";
import Header from "@/components/common/Header";
import { ART_TYPES } from "@/constants/art";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getMyArtworkDetail, updateArtwork } from "@/services/artworks";
import type { ArtworkDetail } from "@/types/archiveDetail";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

function toDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function toDateString(value: Date | undefined) {
  if (!value) return undefined;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "작품 수정에 실패했습니다.";
}

function ArtEditForm({ artwork, artworkId }: { artwork: ArtworkDetail; artworkId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [artType, setArtType] = useState(artwork.artworkType ?? "");
  const [title, setTitle] = useState(artwork.title ?? "");
  const [description, setDescription] = useState(artwork.description ?? "");
  const [date, setDate] = useState<Date | undefined>(() => toDate(artwork.createdDate));
  const [selectedRegions, setSelectedRegions] = useState<string[]>(artwork.availableRegions ?? []);
  const [width, setWidth] = useState(artwork.widthCm ? String(artwork.widthCm) : "");
  const [depth, setDepth] = useState(artwork.depthCm ? String(artwork.depthCm) : "");
  const [height, setHeight] = useState(artwork.heightCm ? String(artwork.heightCm) : "");
  const [notes, setNotes] = useState(artwork.caution ?? "");
  const [isPublic, setIsPublic] = useState(artwork.status === "PUBLISHED");
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateArtwork(artworkId, {
        title: title.trim(),
        artworkType: artType,
        description: description.trim(),
        caution: notes.trim(),
        sizeType: artwork.sizeType ?? "STANDARD",
        widthCm: toNullableNumber(width),
        heightCm: toNullableNumber(height),
        depthCm: toNullableNumber(depth),
        createdDate: toDateString(date),
        isPublic,
        imageIds: artwork.imageIds,
        thumbnailIndex: artwork.thumbnailIndex ?? 0,
        availableRegions: selectedRegions,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mypage", "feed"] });
      void queryClient.invalidateQueries({ queryKey: ["artwork-detail", artworkId] });
      void queryClient.invalidateQueries({ queryKey: ["mypage", "artwork", artworkId] });
      router.replace("/mypage/feed");
    },
    onError: error => {
      setSubmitErrorMessage(getErrorMessage(error));
    },
  });

  const isFormValid =
    title.trim() !== "" &&
    artType !== "" &&
    description.trim() !== "" &&
    description.length <= 500 &&
    notes.length <= 500;

  return (
    <>
      <section className="flex flex-col gap-6 px-5 py-6 pb-32">
        <FieldWrapper>
          <Label required>사진</Label>
          <div className="flex flex-wrap gap-3">
            {artwork.imageUrls.map((url, index) => {
              const imageUrl = normalizeImageUrl(url);
              if (!imageUrl) return null;
              return (
                <div
                  key={`${imageUrl}-${index}`}
                  className="border-border-primary relative h-18 w-18 overflow-hidden rounded-sm border"
                >
                  <Image
                    src={imageUrl}
                    alt={`작품 이미지 ${index + 1}`}
                    fill
                    sizes="72px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </FieldWrapper>

        <FieldWrapper>
          <Label required>작품 유형</Label>
          <Dropdown
            required
            placeholder="작품 유형을 선택해주세요."
            options={ART_TYPES}
            value={artType}
            onChange={setArtType}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label required>작품명 (최대 10자)</Label>
          <Input
            required
            placeholder="작품명을 작성해주세요."
            deleteButton
            maxLength={10}
            value={title}
            onChange={setTitle}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label required>작품 설명</Label>
          <Textarea
            placeholder="작품 설명을 작성해주세요."
            maxLength={500}
            value={description}
            onChange={setDescription}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>작품 제작일</Label>
          <DatePicker value={date} onChange={setDate} />
        </FieldWrapper>

        <FieldWrapper>
          <Label>희망 전시 지역</Label>
          <RegionSelect value={selectedRegions} onChange={setSelectedRegions} />
        </FieldWrapper>

        <FieldWrapper>
          <Label>전시 필요 공간 크기 (cm)</Label>
          <SizeInput
            width={width}
            depth={depth}
            height={height}
            onWidthChange={setWidth}
            onDepthChange={setDepth}
            onHeightChange={setHeight}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>주의 사항</Label>
          <Textarea
            placeholder="주의 사항 설명"
            maxLength={500}
            value={notes}
            onChange={setNotes}
          />
        </FieldWrapper>

        <FieldWrapper>
          <div className="flex items-center justify-between py-3">
            <Label>피드 내 공개</Label>
            <ToggleButton value={isPublic} onChange={setIsPublic} />
          </div>
        </FieldWrapper>
      </section>

      <div className="border-border-primary fixed right-0 bottom-4 left-0 h-24.5 border-t bg-white px-5 py-4">
        {submitErrorMessage && (
          <p role="alert" className="text-caption text-error-default mb-2">
            {submitErrorMessage}
          </p>
        )}
        <button
          type="button"
          disabled={!isFormValid || updateMutation.isPending}
          onClick={() => {
            setSubmitErrorMessage(null);
            updateMutation.mutate();
          }}
          className={`text-body-1 h-12.5 w-full rounded-lg font-medium transition-colors ${
            isFormValid && !updateMutation.isPending
              ? "bg-object-primary text-text-invert cursor-pointer"
              : "bg-object-disabled text-text-disabled cursor-not-allowed"
          }`}
        >
          {updateMutation.isPending ? "수정 중..." : "수정하기"}
        </button>
      </div>
    </>
  );
}

export default function ArtEditPage() {
  const params = useParams<{ id: string }>();
  const artworkId = params.id;
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetch = isAuthReady && isAuthenticated && Boolean(artworkId);

  const query = useQuery({
    queryKey: ["mypage", "artwork", artworkId],
    queryFn: ({ signal }) => getMyArtworkDetail(artworkId, signal),
    enabled: canFetch,
  });

  if (!isAuthReady || !isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-white">
      <Header title="작품 수정" showBack />

      {query.isLoading ? (
        <section className="px-5 py-6">
          <p className="text-body-2 text-text-secondary">작품 정보를 불러오는 중입니다.</p>
        </section>
      ) : query.isError || !query.data ? (
        <section className="px-5 py-6">
          <p className="text-body-2 text-error-default">작품 정보를 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
          >
            다시 불러오기
          </button>
        </section>
      ) : (
        <ArtEditForm key={query.data.id} artwork={query.data} artworkId={artworkId} />
      )}
    </main>
  );
}
