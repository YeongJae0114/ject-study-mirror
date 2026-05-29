"use client";

import { ART_TYPES } from "@/constants/art";

interface ArtTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtTooltip({ isOpen, onClose }: ArtTooltipProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-object-secondary text-text-invert absolute right-0 z-50 mt-2 h-50 w-[218px] rounded-md p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-label font-semibold">작품 유형</span>
        <button type="button" onClick={onClose} className="text-object-white">
          <span className="h-4 w-4">✕</span>
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        {ART_TYPES.map(type => (
          <div key={type.label} className="text-text-invert text-caption flex flex-col gap-0.5">
            <div className="font-semibold">{type.label}</div>
            <div className="font-regular">{type.description}</div>
          </div>
        ))}
      </div>

      {/* 상단 작은 말풍선 삼각형 꼬리 */}
      <div className="absolute -top-1 right-3 h-3 w-3 rotate-45 bg-[#2C2C2E]" />
    </div>
  );
}
