import { apiClient } from "@/services/apiClient";
import type { MypageFeedResponse } from "@/types/mypage";

interface GetMypageFeedParams {
  page?: number;
  size?: number;
}

export const getMypageFeed = ({ page = 0, size = 20 }: GetMypageFeedParams = {}) => {
  return apiClient.get<MypageFeedResponse>("/api/v1/mypage/feed", { page, size });
};
