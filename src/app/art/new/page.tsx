"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ArtTooltip from "@/components/archive-form/ArtToolTip";
import DatePicker from "@/components/archive-form/DayPicker";
import Dropdown from "@/components/archive-form/Dropdown";
import ImageUploader from "@/components/archive-form/ImageUploader";
import Input from "@/components/archive-form/Input";
import Label from "@/components/archive-form/Label";
import RegionSelect from "@/components/archive-form/RegionSelect";
import SizeInput from "@/components/archive-form/SizeInput";
import Textarea from "@/components/archive-form/Textarea";
import ToggleButton from "@/components/archive-form/ToggleButton";
import Header from "@/components/common/Header";
import { ART_TYPES } from "@/constants/art";
import { useUploadImage } from "@/hooks/useImageUploader";
import { createArtwork } from "@/services/artworks";
import { useImageStore } from "@/stores/useImageStore";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "작품 등록에 실패했습니다.";
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

export default function ArtCreatePage() {
  const router = useRouter();

  const images = useImageStore(state => state.images);
  const clearImages = useImageStore(state => state.clearImages);

  const [artType, setArtType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState<Date>();

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const [notes, setNotes] = useState("");

  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const isFormValid =
    images.length > 0 &&
    artType !== "" &&
    title.trim() !== "" &&
    description.trim() !== "" &&
    description.length <= 500 &&
    notes.length <= 500;

  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutateAsync: createArtworkMutation } = useMutation({
    mutationFn: createArtwork,
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      const uploadedImages = await Promise.all(images.map(image => uploadImage(image.file)));
      await createArtworkMutation({
        title: title.trim(),
        artworkType: artType,
        description: description.trim(),
        ...(notes.trim() !== "" ? { caution: notes.trim() } : {}),
        widthCm: toNullableNumber(width),
        heightCm: toNullableNumber(height),
        depthCm: toNullableNumber(depth),
        ...(date ? { createdDate: date.toISOString().split("T")[0] } : {}),
        isPublic,
        imageIds: uploadedImages.map(image => image.imageId),
        thumbnailIndex: 0,
        ...(selectedRegions.length > 0 ? { availableRegions: selectedRegions } : {}),
      });

      clearImages();
      router.push("/");
    } catch (error) {
      setSubmitErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header title="작품 추가" showBack={true} />

      {/* Content */}
      <section className="flex flex-col gap-6 px-5 py-6 pb-32">
        {/* 사진 업로드 */}
        <FieldWrapper>
          <Label required>사진 업로드</Label>
          <ImageUploader />
        </FieldWrapper>

        {/* 작품 유형 */}
        <FieldWrapper>
          <div className="flex justify-between">
            <Label required>작품 유형</Label>
            <div className="relative">
              <Image
                src="/info-icon.svg"
                alt="작품 유형"
                width={20}
                height={20}
                className="mr-2 cursor-pointer"
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              />

              <ArtTooltip isOpen={isTooltipOpen} onClose={() => setIsTooltipOpen(false)} />
            </div>
          </div>
          <Dropdown
            required
            placeholder="작품 유형을 선택해주세요."
            options={ART_TYPES}
            value={artType}
            onChange={setArtType}
          />
        </FieldWrapper>

        {/* 작품명 */}
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

        {/* 작품 설명 */}
        <FieldWrapper>
          <Label required>작품 설명</Label>
          <Textarea
            placeholder="작품 설명을 작성해주세요."
            maxLength={500}
            value={description}
            onChange={setDescription}
          />
        </FieldWrapper>

        {/* 제작일 */}
        <FieldWrapper>
          <Label>작품 제작일</Label>
          <DatePicker label="작품 제작일" value={date} onChange={setDate} />
        </FieldWrapper>

        {/* 희망 전시 지역 */}
        <FieldWrapper>
          <Label>희망 전시 지역</Label>
          <RegionSelect value={selectedRegions} onChange={setSelectedRegions} />
        </FieldWrapper>

        {/* 공간 크기 */}
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

        {/* 주의사항 */}
        <FieldWrapper>
          <Label>주의 사항</Label>
          <Textarea
            placeholder="주의 사항 설명"
            maxLength={500}
            value={notes}
            onChange={setNotes}
          />
        </FieldWrapper>

        {/* 피드 내 공개 */}
        <FieldWrapper>
          <div className="flex items-center justify-between py-3">
            <Label>피드 내 공개</Label>
            <ToggleButton value={isPublic} onChange={setIsPublic} />
          </div>
        </FieldWrapper>
      </section>

      {/* Bottom Button () */}
      <div className="border-border-primary fixed right-0 bottom-4 left-0 h-24.5 border-t bg-white px-5 py-4">
        {submitErrorMessage && (
          <p role="alert" className="text-caption text-error-default mb-2">
            {submitErrorMessage}
          </p>
        )}
        <button
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
          className={`text-body-1 h-12.5 w-full rounded-lg font-medium transition-colors ${
            isFormValid && !isSubmitting
              ? "bg-object-primary text-text-invert cursor-pointer"
              : "bg-object-disabled text-text-disabled cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "등록 중..." : "추가하기"}
        </button>
      </div>
    </main>
  );
}
