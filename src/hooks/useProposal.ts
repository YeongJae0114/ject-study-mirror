/** 전시 제안 단건 상세 훅. PROPOSAL_CARD의 referenceId로 조회. 키: ['proposal', id]. */

import { useQuery } from "@tanstack/react-query";
import { getProposal } from "@/services/proposalApi";
import { getAccessToken } from "@/services/session";
import type { Proposal } from "@/types/proposal";

export function proposalKey(id: number) {
  return ["proposal", id] as const;
}

export function useProposal(id: number) {
  return useQuery<Proposal>({
    queryKey: proposalKey(id),
    queryFn: () => getProposal(id),
    enabled: Boolean(getAccessToken()) && Number.isFinite(id),
  });
}
