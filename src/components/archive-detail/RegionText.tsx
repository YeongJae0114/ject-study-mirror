"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface RegionTextProps {
  regions: string[];
}

export default function RegionText({ regions }: RegionTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasRegions = regions && regions.length > 0;
  if (!hasRegions) return null;

  const isSeoulAll = regions.length === 1 && ["서울 전체", "서울특별시 전체"].includes(regions[0]);
  const hasAccordion = !isSeoulAll && regions.length > 3;

  const regionText = isSeoulAll
    ? "서울특별시 전체"
    : hasAccordion
      ? `서울특별시 ${regions.slice(0, 3).join(", ")} 외 ${regions.length - 3}개`
      : `서울특별시 ${regions.join(", ")}`;

  return (
    <div>
      <button
        onClick={() => hasAccordion && setIsOpen(!isOpen)}
        className="flex w-full items-end justify-between py-2 text-left"
        disabled={!hasAccordion}
      >
        <div className="text-text-primary flex-1">
          <div className="text-label mb-1 font-semibold">희망 전시 지역</div>
          <div className="text-body-2 font-regular">{regionText}</div>
        </div>

        {hasAccordion && (
          <ChevronDown
            size={20}
            className={`text-object-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {hasAccordion && isOpen && (
        <div className="animate-fadeIn bg-object-gray mt-2 rounded-lg p-3.5">
          <p className="text-label font-regular text-text-secondary leading-relaxed">
            {isSeoulAll ? "서울특별시 전체" : `서울특별시 ${regions.join(", ")}`}
          </p>
        </div>
      )}
    </div>
  );
}
