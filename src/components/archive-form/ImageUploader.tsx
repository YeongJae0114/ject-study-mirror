"use client";

import { useImageStore } from "@/stores/useImageStore";

export default function ImageUploader() {
  const images = useImageStore((state) => state.images);
  const addImageFiles = useImageStore((state) => state.addImageFiles);
  const removeImage = useImageStore((state) => state.removeImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addImageFiles(files);
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-3 items-center mt-2">
      {/* 카메라 버튼 */}
      <label className="w-18 h-18 bg-bg-primary-darker rounded-sm flex flex-col justify-center items-center shrink-0">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <img src="/camera-icon.svg" alt="camera" />
        <div className="text-caption font-regular text-text-secondary">
          {images.length}/10
        </div>
      </label>

      {/* 이미지 미리보기 */}
      {images.map((image, index) => (
        <div
          key={image.url}
          className="relative w-18 h-18 rounded-sm overflow-hidden shrink-0"
        >
          <img
            src={image.url}
            alt="미리보기"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeImage(index, image.url)}
            className="absolute top-2 right-2 w-4 h-4"
          >
            <img src="/cancel-icon.svg" alt="삭제" />
          </button>
        </div>
      ))}
    </div>
  );
}
