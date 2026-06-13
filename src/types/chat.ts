/**
 * 채팅 도메인 타입 (데이터 계약 단일 출처). 필드 camelCase, id=number, 날짜=string.
 * 함정: 본문은 `content`, 읽음은 `read`, 방 id는 `chatRoomId`. `isOwn` 없음 → `senderId === myUserId`(session.ts)로 계산.
 * `createdAt`/`lastMessageAt`은 타임존 없는 LocalDateTime 문자열(서버 로컬).
 */

/** 채팅방이 연결된 대상 종류 */
export type ChatContextType = "ARTWORK" | "SPACE";

/** 채팅방이 연결된 대상(작품/공간) 정보. title·thumbnailUrl은 nullable. */
export interface ChatContext {
  type: ChatContextType;
  id: number;
  title: string | null;
  thumbnailUrl: string | null;
}

/** 채팅 참여자. nickname 미설정 시 null, profileImage는 현재 항상 null(백엔드 미구현). */
export interface Participant {
  id: number;
  nickname: string | null;
  profileImage: string | null;
}

/** 채팅방 상세/생성 응답. ARTWORK: artist=작품소유자/host=요청자, SPACE: artist=요청자/host=공간소유자. */
export interface ChatRoom {
  id: number;
  context: ChatContext;
  artist: Participant;
  host: Participant;
  lastMessageAt: string | null;
  createdAt: string;
}

/**
 * POST /chat-rooms 응답. 백엔드가 lazy 생성으로 바뀌어 방이 아직 없으면 id=null.
 * id=null이면 첫 메시지(POST /chat-rooms/messages) 전송 시 방이 생성된다.
 * context·artist·host는 id 유무와 무관하게 항상 포함되어 대기 화면 렌더에 사용한다.
 */
export interface CreateChatRoomResult {
  id: number | null;
  context: ChatContext;
  artist: Participant;
  host: Participant;
  lastMessageAt?: string | null;
  createdAt?: string;
}

/** 첫 메시지 전송 본문(REST). 방이 없을 때 targetType/targetId로 방을 생성하며 전송. */
export interface SendFirstMessageBody {
  targetType: ChatContextType;
  targetId: number;
  content: string;
}

/** 첫 메시지 전송 응답. 생성된 방 id를 chatRoomId로 반환 → 이후 STOMP 구독에 사용. */
export interface SendFirstMessageResult {
  chatRoomId: number;
}

/** 채팅방 목록 item. counterparty=요청자 기준 상대방. lastMessage(항상 null)·unreadCount(항상 0)는 백엔드 미구현(시안 갭). */
export interface ChatRoomListItem {
  id: number;
  context: ChatContext;
  counterparty: Participant;
  lastMessage: string | null;
  unreadCount: number;
  lastMessageAt: string | null;
}

/**
 * 메시지 종류. TEXT=일반 말풍선, PROPOSAL_CARD/AGREEMENT_LINK=시스템 메시지(referenceId로 상세 조회).
 * PROPOSAL_CARD→referenceId=proposalId, AGREEMENT_LINK→referenceId=agreementId.
 */
export type MessageType = "TEXT" | "PROPOSAL_CARD" | "AGREEMENT_LINK";

/** 메시지. STOMP 수신 + REST 이력 item 공용. 읽음 필드명은 `read`(isRead 아님). */
export interface Message {
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string;
  messageType: MessageType;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
}

/** 메시지 전송 본문(STOMP publish). 최대 2000자. */
export interface SendMessageBody {
  content: string;
}

/** 채팅방 생성 요청 본문(REST POST). */
export interface CreateChatRoomBody {
  targetType: ChatContextType;
  targetId: number;
}

/** 2xx 공통 성공 래퍼. 훅·컴포넌트는 이 래퍼를 모르고 `.data`만 본다. */
export interface ApiEnvelope<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

/** 4xx/5xx 공통 에러 래퍼. 프론트는 error.code로 분기. fields는 VALIDATION_ERROR일 때만. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields: Array<{ field: string; reason: string }> | null;
  };
}

/** opaque cursor 페이지네이션 응답. 끝이면 hasNext=false & nextCursor=null. */
export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

/**
 * 전시 제안 폼 입력값. targetId는 컨텍스트 ARTWORK→공간 id, SPACE→작품 id. 날짜는 yyyy-MM-dd.
 */
export interface ProposeExhibitionDraft {
  targetId: number;
  title: string;
  startDate: string;
  endDate: string;
}

/** STOMP errors 큐(`/sub/users/{userId}/errors`) payload. */
export interface SocketErrorPayload {
  error: {
    code: string;
    message: string;
    fields: Array<{ field: string; reason: string }> | null;
  };
}
