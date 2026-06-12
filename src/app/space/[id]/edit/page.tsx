"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import AddressSearch from "@/components/archive-form/AddressSearch";
import Dropdown from "@/components/archive-form/Dropdown";
import Input from "@/components/archive-form/Input";
import Label from "@/components/archive-form/Label";
import SizeInput from "@/components/archive-form/SizeInput";
import Textarea from "@/components/archive-form/Textarea";
import ToggleButton from "@/components/archive-form/ToggleButton";
import Header from "@/components/common/Header";
import { ART_TYPES } from "@/constants/art";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getMySpaceDetail, updateSpace } from "@/services/spaces";
import type { SpaceDetail } from "@/types/archiveDetail";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "공간 수정에 실패했습니다.";
}

function SpaceEditForm({ space, spaceId }: { space: SpaceDetail; spaceId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [spaceType, setSpaceType] = useState(space.spaceType ?? "");
  const [title, setTitle] = useState(space.title ?? "");
  const [description, setDescription] = useState(space.description ?? "");
  const [address, setAddress] = useState(space.address ?? "");
  const [width, setWidth] = useState(space.widthCm ? String(space.widthCm) : "");
  const [depth, setDepth] = useState(space.depthCm ? String(space.depthCm) : "");
  const [height, setHeight] = useState(space.heightCm ? String(space.heightCm) : "");
  const [notes, setNotes] = useState(space.caution ?? "");
  const [isPublic, setIsPublic] = useState(space.isPublic);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateSpace(spaceId, {
        title: title.trim(),
        spaceType,
        address: address.trim(),
        description: description.trim(),
        caution: notes.trim(),
        widthCm: toNullableNumber(width),
        heightCm: toNullableNumber(height),
        depthCm: toNullableNumber(depth),
        isPublic,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mypage", "feed"] });
      void queryClient.invalidateQueries({ queryKey: ["space-detail", spaceId] });
      void queryClient.invalidateQueries({ queryKey: ["mypage", "space", spaceId] });
      router.replace("/mypage/feed");
    },
    onError: error => {
      setSubmitErrorMessage(getErrorMessage(error));
    },
  });

  const isFormValid =
    title.trim() !== "" &&
    spaceType !== "" &&
    address.trim() !== "" &&
    description.trim() !== "" &&
    description.length <= 500 &&
    notes.length <= 500;

  return (
    <>
      <section className="flex flex-col gap-6 px-5 py-6 pb-32">
        <FieldWrapper>
          <Label required>사진</Label>
          <div className="flex flex-wrap gap-3">
            {space.imageUrls.map((url, index) => {
              const imageUrl = normalizeImageUrl(url);
              if (!imageUrl) return null;
              return (
                <div
                  key={`${imageUrl}-${index}`}
                  className="border-border-primary relative h-18 w-18 overflow-hidden rounded-sm border"
                >
                  <Image
                    src={imageUrl}
                    alt={`공간 이미지 ${index + 1}`}
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
          <Label required>공간 유형</Label>
          <Dropdown
            required
            placeholder="공간 유형을 선택해주세요."
            options={ART_TYPES}
            value={spaceType}
            onChange={setSpaceType}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label required>공간명 (최대 10자)</Label>
          <Input
            required
            placeholder="공간명을 작성해주세요."
            deleteButton
            maxLength={10}
            value={title}
            onChange={setTitle}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label required>공간 주소</Label>
          <AddressSearch value={address} onChange={setAddress} />
        </FieldWrapper>

        <FieldWrapper>
          <Label required>공간 설명</Label>
          <Textarea
            placeholder="공간 설명을 작성해주세요."
            maxLength={500}
            value={description}
            onChange={setDescription}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>제공 가능 공간 크기 (cm)</Label>
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

export default function SpaceEditPage() {
  const params = useParams<{ id: string }>();
  const spaceId = params.id;
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const canFetch = isAuthReady && isAuthenticated && Boolean(spaceId);

  const query = useQuery({
    queryKey: ["mypage", "space", spaceId],
    queryFn: ({ signal }) => getMySpaceDetail(spaceId, signal),
    enabled: canFetch,
  });

  if (!isAuthReady || !isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-white">
      <Header title="공간 수정" showBack />

      {query.isLoading ? (
        <section className="px-5 py-6">
          <p className="text-body-2 text-text-secondary">공간 정보를 불러오는 중입니다.</p>
        </section>
      ) : query.isError || !query.data ? (
        <section className="px-5 py-6">
          <p className="text-body-2 text-error-default">공간 정보를 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="border-border-primary text-body-2 text-text-primary mt-3 h-9 rounded-lg border px-4 font-medium"
          >
            다시 불러오기
          </button>
        </section>
      ) : (
        <SpaceEditForm key={query.data.id} space={query.data} spaceId={spaceId} />
      )}
    </main>
  );
}
