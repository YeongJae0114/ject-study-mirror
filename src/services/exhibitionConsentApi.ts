import { apiClient } from "@/services/apiClient";
import type {
  ExhibitionConsent,
  SubmitExhibitionConsentBody,
  SubmitExhibitionConsentResult,
} from "@/types/exhibitionConsent";

export function getExhibitionConsent(exhibitionId: number): Promise<ExhibitionConsent> {
  return apiClient.get<ExhibitionConsent>(`/api/v1/exhibitions/${exhibitionId}/consent`);
}

export function getReadonlyExhibitionConsent(exhibitionId: number): Promise<ExhibitionConsent> {
  return apiClient.get<ExhibitionConsent>(
    `/api/v1/exhibitions/${exhibitionId}/consent?mode=readonly`
  );
}

export function submitExhibitionConsent(
  exhibitionId: number,
  body: SubmitExhibitionConsentBody
): Promise<SubmitExhibitionConsentResult> {
  return apiClient.post<SubmitExhibitionConsentResult>(
    `/api/v1/exhibitions/${exhibitionId}/consent`,
    body
  );
}
