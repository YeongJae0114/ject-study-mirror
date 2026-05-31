import { apiClient } from "./apiClient";

export interface CreateSpaceRequest {
  title: string;
  description: string;
  imageIds: number[];
}

// 공간 등록 요청
export const createSpace = (payload: CreateSpaceRequest) => {
  return apiClient.post("api/v1/spaces", payload);
};
