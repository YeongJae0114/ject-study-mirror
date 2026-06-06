import { apiClient } from "./apiClient";
import type { ArtworkFeedItem, FeedPage } from "@/types/feed";

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

  isPublic?: boolean;

  imageIds: number[];

  thumbnailIndex: number;

  availableRegions: string[];
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
