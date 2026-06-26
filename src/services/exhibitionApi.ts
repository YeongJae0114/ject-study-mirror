import { apiClient } from "@/services/apiClient";
import type {
  CancelExhibitionBody,
  CancelExhibitionResult,
  ExhibitionDetail,
  ExhibitionListResponse,
  ExhibitionStatusFilter,
} from "@/types/exhibition";

interface GetMyExhibitionsParams {
  filter?: ExhibitionStatusFilter;
  page?: number;
  size?: number;
}

export function getMyExhibitions({
  filter,
  page = 0,
  size = 20,
}: GetMyExhibitionsParams): Promise<ExhibitionListResponse> {
  return apiClient.get<ExhibitionListResponse>("/api/v1/exhibitions/me", {
    filter,
    page,
    size,
  });
}

export function getExhibitionDetail(exhibitionId: number): Promise<ExhibitionDetail> {
  return apiClient.get<ExhibitionDetail>(`/api/v1/exhibitions/${exhibitionId}`);
}

export function cancelExhibition(
  exhibitionId: number,
  body: CancelExhibitionBody
): Promise<CancelExhibitionResult> {
  return apiClient.post<CancelExhibitionResult>(`/api/v1/exhibitions/${exhibitionId}/cancel`, body);
}
