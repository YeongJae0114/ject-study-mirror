import React, { useState } from "react";

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
        <div className="from-object-primary-light to-object-primary-light/50 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br shadow-lg">
          {imageUrl ? (
            <img src={imageUrl} alt="프로필 이미지" className="h-full w-full object-cover" />
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-object-primary"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <label className="from-object-primary to-object-primary-hover shadow-medium absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br transition-all hover:shadow-lg active:shadow-none">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
