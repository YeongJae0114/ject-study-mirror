import { apiClient } from "@/services/apiClient";
import type { ProfileActivityResponse, ProfileFeedResponse, PublicProfile } from "@/types/profile";

interface ProfilePageParams {
  page?: number;
  size?: number;
}

export const getPublicProfile = (userId: string | number, signal?: AbortSignal) => {
  return apiClient.get<PublicProfile>(`/api/v1/profiles/${userId}`, undefined, signal);
};

export const getPublicProfileFeed = (
  userId: string | number,
  { page = 0, size = 20 }: ProfilePageParams = {},
  signal?: AbortSignal
) => {
  return apiClient.get<ProfileFeedResponse>(
    `/api/v1/profiles/${userId}/feed`,
    { page, size },
    signal
  );
};

export const getPublicProfileActivities = (
  userId: string | number,
  { page = 0, size = 20 }: ProfilePageParams = {},
  signal?: AbortSignal
) => {
  return apiClient.get<ProfileActivityResponse>(
    `/api/v1/profiles/${userId}/activities`,
    { page, size },
    signal
  );
};
