"use client";

import { useImageStore } from "@/stores/useImageStore";

export default function ImageUploader() {
  const images = useImageStore(state => state.images);
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
    <div className="mt-2 flex flex-wrap items-center gap-3">
      {/* 카메라 버튼 */}
      <label className="bg-bg-primary-darker flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-sm">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <img src="/camera-icon.svg" alt="camera" />
        <div className="text-caption font-regular text-text-secondary">{images.length}/10</div>
      </label>

      {/* 이미지 미리보기 */}
      {images.map((image, index) => (
        <div key={image.url} className="relative h-18 w-18 shrink-0 overflow-hidden rounded-sm">
          <img src={image.url} alt="미리보기" className="h-full w-full object-cover" />
          <button
            onClick={() => removeImage(index, image.url)}
            className="absolute top-2 right-2 h-4 w-4"
          >
            <img src="/cancel-icon.svg" alt="삭제" />
          </button>
        </div>
      ))}
    </div>
  );
}
