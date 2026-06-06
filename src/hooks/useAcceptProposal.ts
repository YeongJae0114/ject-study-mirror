// 제안 수락 mutation. 성공 시 제안 상세 invalidate(ACCEPTED 반영). 합의서 링크는 STOMP로 도착.

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptProposal } from "@/services/proposalApi";
import type { AcceptProposalResult } from "@/types/proposal";

export function useAcceptProposal() {
  const queryClient = useQueryClient();

  return useMutation<AcceptProposalResult, Error, number>({
    mutationFn: id => acceptProposal(id),
    // 수락 시 같은 방 다른 제안이 EXPIRED 되므로 모든 제안 캐시를 invalidate(형제 카드도 갱신).
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}
