import type { ArtworkDetail } from "@/types/archiveDetail";
import type { ArtworkFeedItem, FeedPage } from "@/types/feed";

import { apiClient } from "./apiClient";

export interface CreateArtworkRequest {
  title: string;
  artworkType: string;
  description: string;
  caution?: string;

  sizeType?: "STANDARD" | "CUSTOM";

  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;

  createdDate?: string;

  isPublic?: boolean;

  imageIds: number[];

  thumbnailIndex?: number;

  availableRegions?: string[];
}

export interface UpdateArtworkRequest {
  title?: string;
  artworkType?: string;
  description?: string;
  caution?: string;
  sizeType?: "STANDARD" | "CUSTOM";
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  createdDate?: string;
  isPublic?: boolean;
  imageIds?: number[];
  thumbnailIndex?: number;
  availableRegions?: string[];
}

interface GetArtworkFeedParams {
  type?: string;
  size?: number;
  cursor?: string;
}

// 작품 등록 요청
export const createArtwork = (payload: CreateArtworkRequest) => {
  return apiClient.post("/api/v1/artworks", payload);
};

export const getArtworkFeed = (params: GetArtworkFeedParams = {}, signal?: AbortSignal) => {
  return apiClient.get<FeedPage<ArtworkFeedItem>>(
    "/api/v1/artworks",
    {
      type: params.type,
      size: params.size,
      cursor: params.cursor,
    },
    signal
  );
};

export const getArtworkDetail = (artworkId: string | number, signal?: AbortSignal) => {
  return apiClient.get<ArtworkDetail>(`/api/v1/artworks/${artworkId}`, undefined, signal);
};

export const getMyArtworkDetail = (artworkId: string | number, signal?: AbortSignal) => {
  return apiClient.get<ArtworkDetail>(`/api/v1/mypage/artworks/${artworkId}`, undefined, signal);
};

export const updateArtwork = (artworkId: string | number, payload: UpdateArtworkRequest) => {
  return apiClient.patch<void>(`/api/v1/artworks/${artworkId}`, payload);
};

export const deleteArtwork = (artworkId: string | number) => {
  return apiClient.delete<void>(`/api/v1/artworks/${artworkId}`);
};
