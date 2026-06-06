// 전시 제안 생성 mutation. 성공 시 PROPOSAL_CARD가 STOMP로 도착하므로 별도 캐시 갱신 불필요.

import { useMutation } from "@tanstack/react-query";

import { createProposal } from "@/services/proposalApi";
import type { CreateProposalBody, Proposal } from "@/types/proposal";

export function useCreateProposal() {
  return useMutation<Proposal, Error, CreateProposalBody>({
    mutationFn: body => createProposal(body),
  });
}
