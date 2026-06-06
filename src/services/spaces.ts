import { apiClient } from "./apiClient";
import type { SpaceDetail } from "@/types/archiveDetail";
import type { FeedPage, SpaceFeedItem } from "@/types/feed";

export interface CreateSpaceRequest {
  title: string;
  spaceType: string;
  address: string;
  description: string;
  caution?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  isPublic?: boolean;
  imageIds: number[];
}

interface GetSpaceFeedParams {
  size?: number;
  cursor?: string;
}

// 공간 등록 요청
export const createSpace = (payload: CreateSpaceRequest) => {
  return apiClient.post("/api/v1/spaces", payload);
};

export const getSpaceFeed = (params: GetSpaceFeedParams = {}, signal?: AbortSignal) => {
  return apiClient.get<FeedPage<SpaceFeedItem>>(
    "/api/v1/spaces/feed",
    {
      size: params.size,
      cursor: params.cursor,
    },
    signal
  );
};

export const getSpaceDetail = (spaceId: string | number, signal?: AbortSignal) => {
  return apiClient.get<SpaceDetail>(`/api/v1/spaces/${spaceId}`, undefined, signal);
};
