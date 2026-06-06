"use client";

import Image from "next/image";

import { useImageStore } from "@/stores/useImageStore";

export default function ImageUploader() {
  const images = useImageStore(state => state.images);
  const errorMessage = useImageStore(state => state.errorMessage);
  const addImageFiles = useImageStore(state => state.addImageFiles);
  const removeImage = useImageStore(state => state.removeImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addImageFiles(files);
    }
    e.target.value = "";
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="bg-bg-primary-darker flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-sm">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Image src="/camera-icon.svg" alt="camera" width={24} height={24} />
          <div className="text-caption font-regular text-text-secondary">{images.length}/10</div>
        </label>

        {images.map((image, index) => (
          <div key={image.url} className="relative h-18 w-18 shrink-0 overflow-hidden rounded-sm">
            <Image
              src={image.url}
              alt="미리보기"
              fill
              unoptimized
              className="object-cover"
              sizes="72px"
            />
            <button
              type="button"
              onClick={() => removeImage(index, image.url)}
              className="absolute top-2 right-2 h-4 w-4"
            >
              <Image src="/cancel-icon.svg" alt="삭제" width={16} height={16} />
            </button>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p role="alert" className="text-caption text-error-default">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
