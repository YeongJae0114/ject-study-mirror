"use client";

interface SizeTextProps {
  title?: string;
  width?: string | number;
  height?: string | number;
  depth?: string | number;
}

export default function SizeText({ title, width, height, depth }: SizeTextProps) {
  const dimensions = [
    { label: "가로", value: width },
    { label: "세로", value: height },
    { label: "높이", value: depth },
  ].filter(item => item.value !== undefined && item.value !== null && item.value !== "");

  if (dimensions.length === 0) return null;

  return (
    <div>
      <h3 className="text-heading-2 text-text-primary mb-3 font-medium">{title}</h3>
      <div
        className="font-regular grid gap-2"
        style={{ gridTemplateColumns: `repeat(${dimensions.length}, minmax(0, 1fr))` }}
      >
        {dimensions.map((item, idx) => (
          <div
            key={idx}
            className="bg-object-gray text-body-1 flex h-12.5 items-center justify-center gap-1 rounded-lg p-4"
          >
            <span className="text-text-primary">{item.label}</span>
            <div className="flex items-center gap-1">
              {item.value && <span className="text-gray-800">{item.value}</span>}
              <span className="text-caption text-text-secondary">cm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
