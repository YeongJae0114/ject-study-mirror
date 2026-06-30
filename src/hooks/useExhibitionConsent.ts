import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getExhibitionConsent,
  getReadonlyExhibitionConsent,
  submitExhibitionConsent,
} from "@/services/exhibitionConsentApi";
import { useSession } from "@/services/session";
import type {
  ExhibitionConsent,
  SubmitExhibitionConsentBody,
  SubmitExhibitionConsentResult,
} from "@/types/exhibitionConsent";

export function exhibitionConsentKey(exhibitionId: number, readonly = false) {
  return ["exhibition", "consent", exhibitionId, readonly ? "readonly" : "write"] as const;
}

export function exhibitionStatusListKey() {
  return ["exhibition", "status", "list"] as const;
}

export function exhibitionDetailKey(exhibitionId: number) {
  return ["exhibition", "detail", exhibitionId] as const;
}

export function useExhibitionConsent(exhibitionId?: number, readonly = false) {
  const { accessToken } = useSession();

  return useQuery<ExhibitionConsent>({
    queryKey: exhibitionConsentKey(exhibitionId ?? -1, readonly),
    queryFn: () =>
      readonly ? getReadonlyExhibitionConsent(exhibitionId!) : getExhibitionConsent(exhibitionId!),
    enabled: Boolean(accessToken) && exhibitionId !== undefined,
  });
}

export function useSubmitExhibitionConsent(exhibitionId: number) {
  const queryClient = useQueryClient();

  return useMutation<SubmitExhibitionConsentResult, Error, SubmitExhibitionConsentBody>({
    mutationFn: body => submitExhibitionConsent(exhibitionId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["exhibition", "consent", exhibitionId] });
      void queryClient.invalidateQueries({ queryKey: exhibitionStatusListKey() });
      void queryClient.invalidateQueries({ queryKey: exhibitionDetailKey(exhibitionId) });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
