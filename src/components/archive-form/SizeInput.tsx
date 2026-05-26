"use client";

import Input from "./Input";

interface SizeInputProps {
  width?: string;
  depth?: string;
  height?: string;

  onWidthChange: (value: string) => void;
  onDepthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
}

export default function SizeInput({
  width,
  depth,
  height,
  onWidthChange,
  onDepthChange,
  onHeightChange,
}: SizeInputProps) {
  return (
    <div className="flex w-full items-center gap-2">
      {/* 가로 */}
      <div className="flex-1 min-w-0">
        <Input
          value={width ?? ""}
          placeholder="가로"
          onlyNumber
          inputMode="numeric"
          onChange={onWidthChange}
        />
      </div>

      <span className="text-coolNeutral-600">×</span>

      {/* 세로 */}
      <div className="flex-1 min-w-0">
        <Input
          value={depth ?? ""}
          placeholder="세로"
          onlyNumber
          inputMode="numeric"
          onChange={onDepthChange}
        />
      </div>

      <span className="text-coolNeutral-600">×</span>

      {/* 높이 */}
      <div className="flex-1 min-w-0">
        <Input
          value={height ?? ""}
          placeholder="높이"
          onlyNumber
          inputMode="numeric"
          onChange={onHeightChange}
        />
      </div>
    </div>
  );
}
