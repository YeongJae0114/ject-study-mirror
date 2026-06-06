"use client";

import { useEffect, useMemo, useRef } from "react";
import AgreementLinkCard from "./AgreementLinkCard";
import MessageBubble from "./MessageBubble";
import ProposalCard from "./ProposalCard";
import { formatDateDivider, isSameDay } from "@/utils/formatChatTime";
import type { Message } from "@/types/chat";

interface MessageListProps {
  /** 이력은 최신순 DESC로 전달 → 내부에서 오름차순으로 뒤집어 표시 */
  messages: Message[];
  /** 본인 메시지 판별 (senderId === myUserId) */
  myUserId: number | null;
  /** 위로 스크롤 시 과거 더 보기 */
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export default function MessageList({
  messages,
  myUserId,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // createdAt(LocalDateTime, 타임존 없음)은 정렬 키로 신뢰 불가 → id(auto-increment) 오름차순 정렬
  const ordered = useMemo(() => [...messages].sort((a, b) => a.id - b.id), [messages]);

  // 새 메시지 도착 시 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [ordered.length]);

  // 맨 위 근처로 스크롤하면 과거 메시지 더 불러오기
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || !onLoadMore) return;
    if (container.scrollTop <= 0 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3">
      {isFetchingNextPage && (
        <div className="text-caption text-text-secondary py-2 text-center">
          이전 메시지를 불러오는 중...
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {ordered.map((message, index) => {
          const prev = index > 0 ? ordered[index - 1] : null;
          const showDivider = prev === null || !isSameDay(prev.createdAt, message.createdAt);

          return (
            <li key={message.id} className="flex flex-col gap-3">
              {showDivider && (
                <div className="flex justify-center py-1">
                  <span className="bg-bg-primary-darker text-caption font-regular text-text-secondary rounded-full px-3 py-1">
                    {formatDateDivider(message.createdAt)}
                  </span>
                </div>
              )}
              {message.messageType === "PROPOSAL_CARD" && message.referenceId !== null ? (
                <ProposalCard proposalId={message.referenceId} myUserId={myUserId} />
              ) : message.messageType === "AGREEMENT_LINK" && message.referenceId !== null ? (
                <AgreementLinkCard agreementId={message.referenceId} />
              ) : (
                <MessageBubble
                  message={message}
                  isOwn={myUserId !== null && message.senderId === myUserId}
                />
              )}
            </li>
          );
        })}
      </ul>

      <div ref={bottomRef} />
    </div>
  );
}
