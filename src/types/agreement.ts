export type AgreementStatus = "DRAFT";

export interface Agreement {
  id: number;
  proposalId: number;
  chatRoomId: number;
  exhibitionId: number | null;
  status: AgreementStatus;
}
