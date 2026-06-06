/**
 * 채팅 시간 포맷 유틸 (순수 함수). 백엔드 LocalDateTime은 타임존 없는 UTC 벽시계 값이라,
 * 'Z'를 붙여 UTC로 파싱해야 KST 9시간 오차가 안 생긴다 (ISO8601 `...Z` 전환 시 자동 무해).
 */

import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

/** 타임존 없는 UTC LocalDateTime 문자열을 Date로 파싱. 이미 타임존이 붙어 있으면 그대로. */
function parseServerDateTime(value: string | null): Date | null {
  if (!value) return null;
  const hasTimezone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value);
  const date = new Date(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 목록의 "30분 전" 상대시간. null이면 빈 문자열. */
export function formatRelativeTime(value: string | null): string {
  const date = parseServerDateTime(value);
  if (!date) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

/** 말풍선 시각 "오후 02:45". null이면 빈 문자열. */
export function formatMessageTime(value: string | null): string {
  const date = parseServerDateTime(value);
  if (!date) return "";
  return format(date, "a hh:mm", { locale: ko });
}

/** 날짜 구분 칩 "2026.05.29 (목)". null이면 빈 문자열. */
export function formatDateDivider(value: string | null): string {
  const date = parseServerDateTime(value);
  if (!date) return "";
  return format(date, "yyyy.MM.dd (EEE)", { locale: ko });
}

/** 두 시각이 같은 날(날짜 구분 칩 분기용)인지. */
export function isSameDay(a: string | null, b: string | null): boolean {
  const da = parseServerDateTime(a);
  const db = parseServerDateTime(b);
  if (!da || !db) return false;
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
