"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

export type EditableArchiveImage =
  | {
      kind: "existing";
      id: number;
      url: string | null;
    }
  | {
      kind: "new";
      file: File;
      url: string;
    };

interface EditableImageUploaderProps {
  images: EditableArchiveImage[];
  onChange: (images: EditableArchiveImage[]) => void;
}

export default function EditableImageUploader({ images, onChange }: EditableImageUploaderProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(
    () => () => {
      imagesRef.current.forEach(image => {
        if (image.kind === "new") {
          URL.revokeObjectURL(image.url);
        }
      });
    },
    []
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      setErrorMessage("사진은 최대 10장까지만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const nextImages: EditableArchiveImage[] = files.map(file => ({
      kind: "new",
      file,
      url: URL.createObjectURL(file),
    }));
    onChange([...images, ...nextImages]);
    setErrorMessage(null);
    event.target.value = "";
  };

  const handleRemove = (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    if (imageToRemove?.kind === "new") {
      URL.revokeObjectURL(imageToRemove.url);
    }
    onChange(images.filter((_, index) => index !== indexToRemove));
    setErrorMessage(null);
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

        {images.map((image, index) => {
          const imageUrl = image.kind === "existing" ? image.url : image.url;

          return (
            <div
              key={image.kind === "existing" ? `existing-${image.id}` : image.url}
              className="bg-bg-primary-darker relative h-18 w-18 shrink-0 overflow-hidden rounded-sm"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <div className="text-caption text-text-secondary flex h-full w-full items-center justify-center">
                  이미지
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 h-4 w-4"
                aria-label="이미지 삭제"
              >
                <Image src="/cancel-icon.svg" alt="" width={16} height={16} />
              </button>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <p role="alert" className="text-caption text-error-default">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
