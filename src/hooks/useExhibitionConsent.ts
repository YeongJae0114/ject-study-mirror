import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getExhibitionConsent, submitExhibitionConsent } from "@/services/exhibitionConsentApi";
import { useSession } from "@/services/session";
import type {
  ExhibitionConsent,
  SubmitExhibitionConsentBody,
  SubmitExhibitionConsentResult,
} from "@/types/exhibitionConsent";

export function exhibitionConsentKey(exhibitionId: number) {
  return ["exhibition", "consent", exhibitionId] as const;
}

export function exhibitionStatusListKey() {
  return ["exhibition", "status", "list"] as const;
}

export function exhibitionDetailKey(exhibitionId: number) {
  return ["exhibition", "detail", exhibitionId] as const;
}

export function useExhibitionConsent(exhibitionId: number) {
  const { accessToken } = useSession();

  return useQuery<ExhibitionConsent>({
    queryKey: exhibitionConsentKey(exhibitionId),
    queryFn: () => getExhibitionConsent(exhibitionId),
    enabled: Boolean(accessToken) && Number.isFinite(exhibitionId),
  });
}

export function useSubmitExhibitionConsent(exhibitionId: number) {
  const queryClient = useQueryClient();

  return useMutation<SubmitExhibitionConsentResult, Error, SubmitExhibitionConsentBody>({
    mutationFn: body => submitExhibitionConsent(exhibitionId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: exhibitionConsentKey(exhibitionId) });
      void queryClient.invalidateQueries({ queryKey: exhibitionStatusListKey() });
      void queryClient.invalidateQueries({ queryKey: exhibitionDetailKey(exhibitionId) });
    },
  });
}
