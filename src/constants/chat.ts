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
