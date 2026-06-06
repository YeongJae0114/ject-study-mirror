import { apiClient } from "./apiClient";
import type { FeedPage, SpaceFeedItem } from "@/types/feed";

export interface CreateSpaceRequest {
  title: string;
  description: string;
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
