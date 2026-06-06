import { apiClient } from "@/services/apiClient";
import type { Agreement } from "@/types/agreement";

export function getAgreement(agreementId: number): Promise<Agreement> {
  return apiClient.get<Agreement>(`/api/v1/agreements/${agreementId}`);
}
