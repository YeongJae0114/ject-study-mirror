"use client";

import { useEffect, useState, type ChangeEvent } from "react";

import { X } from "lucide-react";
import Image from "next/image";

import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ProfileImageInputProps {
  initialImageUrl?: string | null;
  onChange: (file: File | null) => void;
}

export default function ProfileImageInput({ initialImageUrl, onChange }: ProfileImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const displayUrl = previewUrl ?? normalizeImageUrl(initialImageUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    onChange(file);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className="flex justify-center">
      <div className="relative h-20 w-22.5">
        {displayUrl ? (
          <div className="border-border-primary bg-bg-primary-darker flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border">
            <div
              role="img"
              aria-label="프로필 이미지"
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${displayUrl})` }}
            />
          </div>
        ) : (
          <Image src="/profile-edit.svg" alt="" width={90} height={80} className="h-20 w-22.5" />
        )}

        <label className="absolute inset-0 cursor-pointer" aria-label="프로필 이미지 변경">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="bg-bg-secondary text-text-invert absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full"
            aria-label="프로필 이미지 제거"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
