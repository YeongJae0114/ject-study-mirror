/**
 * 전시 제안 도메인 타입. 출처: _workspace/chat/00_input/proposal-api-spec.md (백엔드 #131).
 * 날짜: startDate/endDate=yyyy-MM-dd(LocalDate), createdAt=타임존 없는 LocalDateTime 문자열.
 */

/** 제안 상태. PENDING→ACCEPTED/REJECTED/CANCELED, 같은 방 다른 제안 수락 시 EXPIRED. */
export type ProposalStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REJECTED" | "CANCELED";

/** 제안에 묶인 작품 요약. 대표 이미지 없으면 thumbnailUrl=null. */
export interface ProposalArtwork {
  id: number;
  title: string;
  thumbnailUrl: string | null;
}

/** 제안에 묶인 공간 요약. */
export interface ProposalSpace {
  id: number;
  title: string;
}

/** 제안 상세(생성 201 / 조회 200 공용). */
export interface Proposal {
  id: number;
  status: ProposalStatus;
  chatRoomId: number;
  proposerId: number;
  exhibitionTitle: string;
  startDate: string;
  endDate: string;
  artwork: ProposalArtwork;
  space: ProposalSpace;
  createdAt: string;
}

/** 제안 생성 요청. exhibitionTitle 1~100자, endDate >= startDate. */
export interface CreateProposalBody {
  chatRoomId: number;
  artworkId: number;
  spaceId: number;
  exhibitionTitle: string;
  startDate: string;
  endDate: string;
}

/** 수락 응답. 합의서 DRAFT가 자동 생성되어 agreementId 반환. */
export interface AcceptProposalResult {
  proposalId: number;
  status: ProposalStatus;
  agreementId: number;
}
