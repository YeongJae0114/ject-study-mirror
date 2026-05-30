import { create } from "zustand";

export interface UploadedImage {
  file: File;
  url: string;
}

interface ImageState {
  images: UploadedImage[];
  addImageFiles: (files: File[]) => void;
  removeImage: (indexToRemove: number, urlToRemove: string) => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>(set => ({
  images: [],

  // 이미지 추가
  addImageFiles: files =>
    set(state => {
      if (state.images.length + files.length > 10) {
        alert("사진은 최대 10장까지만 업로드할 수 있습니다.");
        return state;
      }

      const newImages = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
      }));

      return { images: [...state.images, ...newImages] };
    }),

  // 이미지 삭제
  removeImage: (indexToRemove, urlToRemove) =>
    set(state => {
      URL.revokeObjectURL(urlToRemove); // 메모리 해제
      return {
        images: state.images.filter((_, index) => index !== indexToRemove),
      };
    }),

  // 최종 제출 후 스토어 비우기 (API 연동할 때 적용하기!!)
  clearImages: () =>
    set(state => {
      state.images.forEach(img => URL.revokeObjectURL(img.url));
      return { images: [] };
    }),
}));
