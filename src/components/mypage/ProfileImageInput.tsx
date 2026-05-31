"use client";

import { useEffect, useState, type ChangeEvent } from "react";

import { Camera, UserRound, X } from "lucide-react";

interface ProfileImageInputProps {
  onChange: (file: File | null) => void;
}

export default function ProfileImageInput({ onChange }: ProfileImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      <div className="relative">
        <div className="border-border-primary bg-bg-primary-darker flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border">
          {previewUrl ? (
            <div
              role="img"
              aria-label="프로필 이미지"
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${previewUrl})` }}
            />
          ) : (
            <UserRound size={36} className="text-text-disabled" />
          )}
        </div>

        <label className="bg-object-primary text-text-invert shadow-medium absolute right-0 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <Camera size={16} />
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
