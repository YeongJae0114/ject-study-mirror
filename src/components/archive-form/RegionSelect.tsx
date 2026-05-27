"use client";

import { SEOUL_REGIONS } from "@/constants/region";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Drawer } from "vaul";

interface RegionBottomSheetProps {
  value: string[];
  onChange: (regions: string[]) => void;
}

export default function RegionBottomSheet({
  value,
  onChange,
}: RegionBottomSheetProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"seoul" | "other">("seoul");
  const tabs = [
    { key: "seoul", label: "서울" },
    { key: "other", label: "기타 지역" },
  ] as const;

  const toggleRegion = (region: string) => {
    const isAll = region === "서울 전체";

    // 서울 전체 선택
    if (isAll) {
      const alreadySelected = value.includes("서울 전체");

      // 전체 다시 누르면 초기화
      if (alreadySelected) {
        onChange([]);
        return;
      }

      // 전체만 남김
      onChange(["서울 전체"]);
      return;
    }

    const hasAllSelected = value.includes("서울 전체");

    // 서울 전체 제거
    let nextRegions = hasAllSelected
      ? value.filter((item) => item !== "서울 전체")
      : [...value];

    const isSelected = nextRegions.includes(region);

    // 선택 해제, 추가
    if (isSelected) {
      nextRegions = nextRegions.filter((item) => item !== region);
    } else {
      nextRegions.push(region);
    }

    onChange(nextRegions);
  };

  const displayText = value.includes("서울 전체")
    ? "서울특별시 전체"
    : value.length === 0
      ? ""
      : value.length <= 3
        ? `서울특별시 ${value.join(", ")}`
        : `서울특별시 ${value.slice(0, 3).join(", ")} 외 ${value.length - 3}개`;

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`
          flex h-12.5 w-full px-4 rounded-lg border border-border-primary
          items-center justify-between  transition-colors
        `}
      >
        <span
          className={`text-body-1 ${displayText ? "text-text-primary" : "text-text-input"}`}
        >
          {displayText || "지역을 선택해주세요."}
        </span>

        <ChevronDown
          size={20}
          className={`text-object-secondary transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Bottom Sheet */}
      <Drawer.Root
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />

          {/* Content */}
          <Drawer.Content
            className="
            fixed bottom-0 left-0 right-0 z-50
            mx-auto flex h-[70vh] w-full px-5 pt-3
            flex-col rounded-t-3xl
            bg-bg-primary outline-none
          "
          >
            {/* 스크린 리더기 (vaul 라이브러리 권장 사항) */}
            <Drawer.Title className="sr-only">지역 선택</Drawer.Title>
            <Drawer.Description className="sr-only">
              원하는 지역을 목록에서 선택해주세요.
            </Drawer.Description>

            {/* Handle */}
            <div className="flex justify-center">
              <div className="h-1.25 w-9 rounded-full bg-black" />
            </div>

            {/* Header */}
            <h2 className="text-heading-2 font-semibold pt-3 text-text-primary">
              지역 설정하기
            </h2>

            {/* Tab */}
            <div className="mt-5 flex border-b border-border-primary">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 border-b-2 pb-3 text-body-1 font-medium transition-colors
                    ${
                      isActive
                        ? "border-border-secondary text-text-primary-brand"
                        : "border-transparent text-text-secondary"
                    }
                  `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pt-4">
              {activeTab === "seoul" ? (
                <div className="flex flex-col gap-2">
                  {SEOUL_REGIONS.map((region) => {
                    const isSelected = value.includes(region);

                    return (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`
                        flex items-center justify-between
                        rounded-lg p-3 text-body-1 transition-colors
                        ${isSelected ? "bg-object-primary-light" : "bg-white"}
                      `}
                      >
                        <span
                          className={`text-body-1
                        ${
                          isSelected
                            ? "font-semibold text-text-primary-brand"
                            : "font-medium text-text-secondary"
                        }
                      `}
                        >
                          {region}
                        </span>

                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-xs bg-object-primary">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-6">
                  <img
                    src="/empty-icon.svg"
                    alt="empty"
                    className="h-20 w-20"
                  />
                  <p className="text-body-1 font-medium text-text-disabled">
                    아쉽지만 지금은 일부 지역에서만 운영 중이에요.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="pt-3 pb-9">
              <button
                onClick={() => setOpen(false)}
                disabled={activeTab === "other"}
                className={`h-12.5 w-full rounded-lg text-body-1 font-medium transition-colors
                ${
                  activeTab === "other"
                    ? "bg-object-disabled text-text-disabled"
                    : "bg-bg-secondary text-text-invert"
                }
              `}
              >
                완료
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
