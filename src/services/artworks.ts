import { apiClient } from "./apiClient";

export interface CreateArtworkRequest {
  title: string;
  artworkType: string;
  description: string;
  caution?: string;

  sizeType: "STANDARD";

  widthCm?: number;
  heightCm?: number;
  depthCm?: number;

  createdDate?: string;

  imageIds: number[];

  thumbnailIndex: number;

  availableRegions: string[];
}

// 작품 등록 요청
export const createArtwork = (payload: CreateArtworkRequest) => {
  return apiClient.post("/api/v1/artworks", payload);
};
