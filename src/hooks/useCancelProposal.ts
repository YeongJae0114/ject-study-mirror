// 제안 취소 mutation(제안자 본인). 시스템 메시지 발행 없음 → 성공 시 제안 상세 invalidate로 카드 상태(CANCELED) 갱신.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelProposal } from "@/services/proposalApi";
import { proposalKey } from "@/hooks/useProposal";

export function useCancelProposal() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: id => cancelProposal(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: proposalKey(id) });
    },
  });
}
