import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cancelExhibition, getExhibitionDetail, getMyExhibitions } from "@/services/exhibitionApi";
import { useSession } from "@/services/session";
import type {
  CancelExhibitionBody,
  CancelExhibitionResult,
  ExhibitionDetail,
  ExhibitionListResponse,
  ExhibitionStatusFilter,
} from "@/types/exhibition";

export function exhibitionStatusListKey(filter?: ExhibitionStatusFilter) {
  return filter
    ? (["exhibition", "status", "list", filter] as const)
    : (["exhibition", "status", "list"] as const);
}

export function exhibitionDetailKey(exhibitionId: number) {
  return ["exhibition", "detail", exhibitionId] as const;
}

export function useExhibitions(filter?: ExhibitionStatusFilter, page = 0, size = 20) {
  const { accessToken } = useSession();

  return useQuery<ExhibitionListResponse>({
    queryKey: ["exhibitions", filter ?? "ALL", page, size],
    queryFn: () => getMyExhibitions({ filter, page, size }),
    enabled: Boolean(accessToken),
  });
}

export function useInfiniteExhibitions(filter?: ExhibitionStatusFilter, size = 20) {
  const { accessToken } = useSession();

  return useInfiniteQuery<ExhibitionListResponse>({
    queryKey: ["exhibitions", filter ?? "ALL", "infinite", size],
    queryFn: ({ pageParam }) => getMyExhibitions({ filter, page: pageParam as number, size }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: Boolean(accessToken),
  });
}

export function useExhibitionDetail(exhibitionId: number) {
  const { accessToken } = useSession();

  return useQuery<ExhibitionDetail>({
    queryKey: exhibitionDetailKey(exhibitionId),
    queryFn: () => getExhibitionDetail(exhibitionId),
    enabled: Boolean(accessToken) && Number.isFinite(exhibitionId),
  });
}

export function useCancelExhibition(exhibitionId: number) {
  const queryClient = useQueryClient();

  return useMutation<CancelExhibitionResult, Error, CancelExhibitionBody>({
    mutationFn: body => cancelExhibition(exhibitionId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: exhibitionDetailKey(exhibitionId) });
      void queryClient.invalidateQueries({ queryKey: exhibitionStatusListKey() });
      void queryClient.invalidateQueries({ queryKey: ["exhibition", "consent", exhibitionId] });
    },
  });
}
