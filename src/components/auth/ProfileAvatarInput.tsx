import React, { useState } from "react";

import Image from "next/image";

interface ProfileAvatarInputProps {
  onImageChange?: (file: File | null) => void;
}

export default function ProfileAvatarInput({ onImageChange }: ProfileAvatarInputProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      onImageChange?.(file);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    onImageChange?.(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="flex h-20 w-22.5 items-center justify-center overflow-hidden">
          {imageUrl ? (
            <div className="border-border-primary bg-bg-primary-darker h-20 w-20 overflow-hidden rounded-full border">
              <div
                role="img"
                aria-label="프로필 이미지"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            </div>
          ) : (
            <Image src="/profile-edit.svg" alt="" width={90} height={80} className="h-20 w-22.5" />
          )}
        </div>

        <label className="absolute inset-0 cursor-pointer" aria-label="프로필 이미지 변경">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {imageUrl && (
        <button
          onClick={handleRemove}
          className="text-caption text-text-secondary hover:text-text-primary transition-colors"
          type="button"
        >
          이미지 제거
        </button>
      )}
    </div>
  );
}
