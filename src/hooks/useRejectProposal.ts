// 제안 거절 mutation. 시스템 메시지 발행 없음 → 성공 시 제안 상세 invalidate로 카드 상태(REJECTED) 갱신.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectProposal } from "@/services/proposalApi";
import { proposalKey } from "@/hooks/useProposal";

export function useRejectProposal() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: id => rejectProposal(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: proposalKey(id) });
    },
  });
}
