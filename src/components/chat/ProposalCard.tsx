"use client";

import { ImageIcon } from "lucide-react";
import {
  PROPOSAL_ACCEPT_LABEL,
  PROPOSAL_CARD_ARTWORK_LABEL,
  PROPOSAL_CARD_HEADER,
  PROPOSAL_CARD_SCHEDULE_LABEL,
  PROPOSAL_CARD_SPACE_LABEL,
  PROPOSAL_CARD_TITLE_LABEL,
  PROPOSAL_REJECT_LABEL,
  PROPOSAL_STATUS_LABEL,
} from "@/constants/chat";
import { useAcceptProposal } from "@/hooks/useAcceptProposal";
import { useProposal } from "@/hooks/useProposal";
import { useRejectProposal } from "@/hooks/useRejectProposal";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ProposalCardProps {
  proposalId: number;
  /** 제안자(=보낸 사람) 판별용 (proposerId === myUserId) */
  myUserId: number | null;
}

// yyyy-MM-dd → yyyy.MM.dd
function formatDate(date: string) {
  return date.replace(/-/g, ".");
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-caption text-text-primary font-semibold">{label}</span>
      <span className="text-body-2 text-text-secondary break-words">{value}</span>
    </div>
  );
}

export default function ProposalCard({ proposalId, myUserId }: ProposalCardProps) {
  const { data: proposal, isLoading, isError } = useProposal(proposalId);
  const accept = useAcceptProposal();
  const reject = useRejectProposal();

  if (isLoading || isError || !proposal) {
    return (
      <div className="flex justify-start">
        <div className="border-border-chat bg-bg-primary text-body-2 text-text-secondary max-w-[280px] rounded-lg border px-4 py-3">
          {isLoading ? "전시 제안을 불러오는 중..." : "전시 제안을 불러오지 못했어요."}
        </div>
      </div>
    );
  }

  const isProposer = myUserId !== null && proposal.proposerId === myUserId;
  const isPending = proposal.status === "PENDING";
  const isMutating = accept.isPending || reject.isPending;
  const actionError = accept.error ?? reject.error;
  const artworkThumbnailUrl = normalizeImageUrl(proposal.artwork.thumbnailUrl);

  return (
    <div className={`flex ${isProposer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[280px] rounded-lg px-4 py-3 ${
          isProposer ? "bg-object-chat-out" : "border-border-chat bg-bg-primary border"
        } `}
      >
        <div className="text-body-2 text-text-primary font-semibold">{PROPOSAL_CARD_HEADER}</div>

        {/* 제안 정보 + 썸네일 */}
        <div className="mt-3 flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Field label={PROPOSAL_CARD_TITLE_LABEL} value={proposal.exhibitionTitle} />
            <Field
              label={PROPOSAL_CARD_SCHEDULE_LABEL}
              value={`${formatDate(proposal.startDate)} ~ ${formatDate(proposal.endDate)}`}
            />
            <Field label={PROPOSAL_CARD_ARTWORK_LABEL} value={proposal.artwork.title} />
            <Field label={PROPOSAL_CARD_SPACE_LABEL} value={proposal.space.title} />
          </div>

          {artworkThumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artworkThumbnailUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="bg-bg-primary-darker text-text-disabled flex h-14 w-14 shrink-0 items-center justify-center rounded-lg"
            >
              <ImageIcon size={22} />
            </div>
          )}
        </div>

        {/* 받은 사람(대기) → 거절/수락 */}
        {isPending && !isProposer && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={isMutating}
              onClick={() => reject.mutate(proposalId)}
              className="border-border-primary text-body-2 text-text-secondary bg-bg-primary h-10 flex-1 rounded-lg border font-semibold transition-colors disabled:opacity-50"
            >
              {PROPOSAL_REJECT_LABEL}
            </button>
            <button
              type="button"
              disabled={isMutating}
              onClick={() => accept.mutate(proposalId)}
              className="bg-bg-secondary text-body-2 text-text-invert h-10 flex-1 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {PROPOSAL_ACCEPT_LABEL}
            </button>
          </div>
        )}

        {/* 처리 완료 → 상태 라벨 */}
        {!isPending && (
          <div className="bg-bg-primary text-body-2 text-text-secondary mt-3 rounded-lg py-2 text-center font-medium">
            {PROPOSAL_STATUS_LABEL[proposal.status]}
          </div>
        )}

        {actionError && (
          <div className="text-caption text-error-default mt-2">{actionError.message}</div>
        )}
      </div>
    </div>
  );
}
