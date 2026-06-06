/**
 * 채팅 화면 상수 (UI 전용)
 */

/** 채팅방 입력창 placeholder */
export const CHAT_INPUT_PLACEHOLDER = "메시지 입력";

/** 메시지 최대 길이 (백엔드 검증과 동일) */
export const CHAT_MESSAGE_MAX_LENGTH = 2000;

/** 방 목록 헤더 타이틀 */
export const CHAT_LIST_TITLE = "채팅";

/** 빈 상태 문구 */
export const CHAT_EMPTY_MESSAGE = "진행된 채팅 내용이 없어요";

/** 방 목록 로딩 문구 */
export const CHAT_LOADING_MESSAGE = "채팅 목록을 불러오는 중...";

/** ChatRoomInfo의 전시 제안 버튼 라벨 */
export const CHAT_PROPOSE_EXHIBITION_LABEL = "전시 제안하기";

/** context.type 라벨 매핑 */
export const CHAT_CONTEXT_TYPE_LABEL: Record<"ARTWORK" | "SPACE", string> = {
  ARTWORK: "작품",
  SPACE: "공간",
};

/* 전시 제안 바텀시트 */
export const PROPOSE_EXHIBITION_TITLE = "전시 제안하기";
export const PROPOSE_EXHIBITION_SUBTITLE = "전시 기본 정보를 작성해주세요.";
export const PROPOSE_EXHIBITION_NAME_LABEL = "전시 이름";
export const PROPOSE_EXHIBITION_NAME_PLACEHOLDER = "전시 이름을 작성해주세요.";
export const PROPOSE_EXHIBITION_NAME_MAX_LENGTH = 30;
export const PROPOSE_EXHIBITION_SCHEDULE_LABEL = "희망 전시 일정";
export const PROPOSE_EXHIBITION_SUBMIT_LABEL = "완료";

/** context.type별 드롭다운: ARTWORK 채팅=공간 파트너가 공간 선택, SPACE 채팅=크리에이터가 작품 선택 */
export const PROPOSE_EXHIBITION_TARGET: Record<
  "ARTWORK" | "SPACE",
  { label: string; placeholder: string }
> = {
  ARTWORK: { label: "희망 전시 공간", placeholder: "나의 공간 목록에서 선택해주세요." },
  SPACE: { label: "희망 전시 작품", placeholder: "나의 작품 목록에서 선택해주세요." },
};

/* 전시 제안 카드 (PROPOSAL_CARD) */
export const PROPOSAL_CARD_HEADER = "새로운 전시 제안이 도착했습니다.";
export const PROPOSAL_CARD_TITLE_LABEL = "전시명";
export const PROPOSAL_CARD_SCHEDULE_LABEL = "희망 일정";
export const PROPOSAL_CARD_ARTWORK_LABEL = "희망 작품";
export const PROPOSAL_CARD_SPACE_LABEL = "희망 공간";
export const PROPOSAL_ACCEPT_LABEL = "수락하기";
export const PROPOSAL_REJECT_LABEL = "거절하기";

/** 제안 상태 라벨(카드 비활성 상태 표시용) */
export const PROPOSAL_STATUS_LABEL: Record<
  "PENDING" | "ACCEPTED" | "EXPIRED" | "REJECTED" | "CANCELED",
  string
> = {
  PENDING: "수락 대기 중",
  ACCEPTED: "수락됨",
  EXPIRED: "만료됨",
  REJECTED: "거절됨",
  CANCELED: "취소됨",
};

/* 합의서 링크 카드 (AGREEMENT_LINK) */
export const AGREEMENT_CARD_HEADER = "전시 제안이 수락되었어요.";
export const AGREEMENT_CARD_DESC = "전시 현황에서 동의서를 작성해주세요.";
export const AGREEMENT_CARD_ACTION_LABEL = "동의서 작성하기";
