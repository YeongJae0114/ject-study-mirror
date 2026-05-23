"use client";

import { useState } from "react";
import { ART_TYPES } from "@/constants/art";

import Header from "../../../components/common/Header";
import Input from "@/components/archive-form/Input";
import Dropdown from "@/components/archive-form/Dropdown";
import Textarea from "@/components/archive-form/Textarea";
import SizeInput from "@/components/archive-form/SizeInput";
import Label from "@/components/archive-form/Label";
import RegionSelect from "@/components/archive-form/RegionSelect";
import ImageUploader from "@/components/archive-form/ImageUploader";
import { useImageStore } from "@/stores/useImageStore";
import ArtTooltip from "@/components/archive-form/ArtToolTip";
import DatePicker from "@/components/archive-form/DayPicker";
import ToggleButton from "@/components/archive-form/ToggleButton";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export default function ArtCreatePage() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const [date, setDate] = useState<Date>();

  const images = useImageStore((state) => state.images);
  const clearImages = useImageStore((state) => state.clearImages);

  const [isPublic, setIsPublic] = useState(false);

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
              <img
                src="/info-icon.svg"
                alt="작품 유형"
                className="cursor-pointer mr-2"
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              />

              <ArtTooltip
                isOpen={isTooltipOpen}
                onClose={() => setIsTooltipOpen(false)}
              />
            </div>
          </div>
          <Dropdown
            required
            placeholder="작품 유형을 선택해주세요."
            options={ART_TYPES}
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
          />
        </FieldWrapper>

        {/* 작품 설명 */}
        <FieldWrapper>
          <Label required>작품 설명</Label>
          <Textarea placeholder="작품 설명을 작성해주세요." maxLength={500} />
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
          <Textarea placeholder="주의 사항 설명" maxLength={500} />
        </FieldWrapper>

        {/* 피드 내 공개 */}
        <FieldWrapper>
          <div className="flex justify-between items-center py-3">
            <Label>피드 내 공개</Label>
            <ToggleButton value={isPublic} onChange={setIsPublic} />
          </div>
        </FieldWrapper>
      </section>

      {/* Bottom Button () */}
      <div className="fixed bottom-4 left-0 right-0 h-24.5 border-t border-border-primary bg-white px-5 py-4">
        <button className="h-12.5 w-full rounded-lg text-body-1 font-medium text-text-disabled bg-object-disabled">
          추가하기
        </button>
      </div>
    </main>
  );
}
