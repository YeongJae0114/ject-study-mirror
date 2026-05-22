"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
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

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

export default function ArtCreatePage() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");

  const images = useImageStore((state) => state.images);
  const clearImages = useImageStore((state) => state.clearImages);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header title="작품 추가" showBack={true} />

      {/* Content */}
      <section className="flex flex-col gap-8 px-5 py-6 pb-32">
        {/* 사진 업로드 */}
        <FieldWrapper>
          <Label required>사진 업로드</Label>
          <ImageUploader />
          {/* <div className="w-18 h-18 bg-bg-primary-darker rounded-sm flex flex-col justify-center items-center">
            <img src="/camera-icon.svg" alt="camera" />
            <div className="text-caption font-regular">0/10</div>
          </div> */}
        </FieldWrapper>

        {/* 작품 유형 */}
        <FieldWrapper>
          <Dropdown
            label="작품 유형"
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

          <div className="relative">
            <Input placeholder="YYYY.MM.DD" />

            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <CalendarDays size={20} />
            </button>
          </div>
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
      </section>

      {/* Bottom Button */}
      <div className="fixed bottom-9 left-0 right-0 border-t border-border-primary bg-white px-5 py-4">
        <button className="h-12.5 w-full rounded-lg text-body-1 font-medium">
          추가하기
        </button>
      </div>
    </main>
  );
}
