/**
 * 전시 제안 REST 함수. apiClient가 `{data,meta}` → `.data` 언랩, 204(거절/취소)는 undefined 반환.
 * 실패는 ApiError(code) throw → error.code로 분기(PROPOSAL_* / VALIDATION_ERROR 등).
 */

import { apiClient } from "@/services/apiClient";
import type {
  AcceptProposalResult,
  CreateProposalBody,
  Proposal,
  ProposalOptions,
} from "@/types/proposal";

const BASE = "/api/v1/proposals";

/** 제안 생성. 성공 시 채팅방에 PROPOSAL_CARD 시스템 메시지가 STOMP로 발행됨. */
export function createProposal(body: CreateProposalBody): Promise<Proposal> {
  return apiClient.post<Proposal>(BASE, body);
}

/** 제안 상세 조회(방 참여자만). */
export function getProposal(id: number): Promise<Proposal> {
  return apiClient.get<Proposal>(`${BASE}/${id}`);
}

/** 채팅방 기준 전시 제안 선택 후보 조회. */
export function getProposalOptions(chatRoomId: number): Promise<ProposalOptions> {
  return apiClient.get<ProposalOptions>(`${BASE}/options`, { chatRoomId });
}

/** 수락(받은 사람만). 합의서 DRAFT 생성 + AGREEMENT_LINK 메시지 발행. */
export function acceptProposal(id: number): Promise<AcceptProposalResult> {
  return apiClient.post<AcceptProposalResult>(`${BASE}/${id}/accept`);
}

/** 거절(받은 사람만). 204 — 시스템 메시지 발행 없음. */
export function rejectProposal(id: number): Promise<void> {
  return apiClient.post<void>(`${BASE}/${id}/reject`);
}

/** 취소(제안자 본인만). 204 — 시스템 메시지 발행 없음. */
export function cancelProposal(id: number): Promise<void> {
  return apiClient.post<void>(`${BASE}/${id}/cancel`);
}
