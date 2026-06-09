import { useEffect, useRef, useState, type ChangeEvent } from "react";

import Image from "next/image";

const ALLOWED_PROFILE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PROFILE_IMAGE_SIZE = 10 * 1024 * 1024;

interface ProfileAvatarInputProps {
  file?: File | null;
  error?: string;
  onImageChange?: (file: File | null) => void;
  onErrorChange?: (message: string | null) => void;
}

function validateProfileImage(file: File) {
  if (!ALLOWED_PROFILE_IMAGE_TYPES.has(file.type)) {
    return "프로필 이미지는 JPG, PNG, WEBP 형식만 업로드할 수 있습니다.";
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return "프로필 이미지는 10MB 이하만 업로드할 수 있습니다.";
  }

  return null;
}

export default function ProfileAvatarInput({
  file = null,
  error,
  onImageChange,
  onErrorChange,
}: ProfileAvatarInputProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(() =>
    file ? URL.createObjectURL(file) : null
  );
  const imageUrlRef = useRef(imageUrl);

  const replaceImageUrl = (nextImageUrl: string | null) => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
    }

    imageUrlRef.current = nextImageUrl;
    setImageUrl(nextImageUrl);
  };

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const validationMessage = validateProfileImage(file);
    if (validationMessage) {
      replaceImageUrl(null);
      onImageChange?.(null);
      onErrorChange?.(validationMessage);
      return;
    }

    replaceImageUrl(URL.createObjectURL(file));
    onErrorChange?.(null);
    onImageChange?.(file);
  };

  const handleRemove = () => {
    replaceImageUrl(null);
    onErrorChange?.(null);
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
                style={{ backgroundImage: `url("${imageUrl}")` }}
              />
            </div>
          ) : (
            <Image src="/profile-edit.svg" alt="" width={90} height={80} className="h-20 w-22.5" />
          )}
        </div>

        <label className="absolute inset-0 cursor-pointer" aria-label="프로필 이미지 변경">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
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

      {error && (
        <p className="text-caption font-regular text-error-default text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
