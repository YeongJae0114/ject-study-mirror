import { create } from "zustand";

export interface UploadedImage {
  file: File;
  url: string;
}

interface ImageState {
  images: UploadedImage[];
  errorMessage: string | null;
  addImageFiles: (files: File[]) => void;
  removeImage: (indexToRemove: number, urlToRemove: string) => void;
  clearError: () => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>(set => ({
  images: [],
  errorMessage: null,

  addImageFiles: files =>
    set(state => {
      if (state.images.length + files.length > 10) {
        return {
          ...state,
          errorMessage: "사진은 최대 10장까지만 업로드할 수 있습니다.",
        };
      }

      const newImages = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
      }));

      return { images: [...state.images, ...newImages], errorMessage: null };
    }),

  removeImage: (indexToRemove, urlToRemove) =>
    set(state => {
      URL.revokeObjectURL(urlToRemove);
      return {
        images: state.images.filter((_, index) => index !== indexToRemove),
      };
    }),

  clearError: () => set({ errorMessage: null }),

  clearImages: () =>
    set(state => {
      state.images.forEach(img => URL.revokeObjectURL(img.url));
      return { images: [], errorMessage: null };
    }),
}));
