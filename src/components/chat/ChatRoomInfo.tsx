"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";

import ProposeExhibitionSheet from "@/components/chat/ProposeExhibitionSheet";
import { CHAT_CONTEXT_TYPE_LABEL, CHAT_PROPOSE_EXHIBITION_LABEL } from "@/constants/chat";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { getProposalOptions } from "@/services/proposalApi";
import type { ChatContext, ProposeExhibitionDraft } from "@/types/chat";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useRouter } from "next/navigation";

interface ChatRoomInfoProps {
  /** 방이 아직 생성되지 않은 대기 화면(/chat/new)에서는 null → 전시 제안 버튼 숨김. */
  roomId: number | null;
  context: ChatContext;
}

export default function ChatRoomInfo({ roomId, context }: ChatRoomInfoProps) {
  const router = useRouter();
  const [proposeOpen, setProposeOpen] = useState(false);
  const thumbnailUrl = normalizeImageUrl(context.thumbnailUrl);
  const createProposal = useCreateProposal();
  // 방이 생성되기 전에는 전시 제안이 불가하다(제안은 방 컨텍스트에 종속).
  const optionsQuery = useQuery({
    queryKey: ["proposal", "options", roomId],
    queryFn: () => getProposalOptions(roomId as number),
    enabled: proposeOpen,
  });

  const proposalOptions = optionsQuery.data;
  const targetOptions =
    proposalOptions?.selection.items.map(item => {
      const visibilityLabel = item.isPublic ? null : "비공개";
      const description = [item.subtitle, visibilityLabel].filter(Boolean).join(" · ");

      return {
        label: item.title,
        value: String(item.id),
        description: description || undefined,
      };
    }) ?? [];

  const targetMessage = optionsQuery.isLoading
    ? "목록을 불러오는 중입니다."
    : optionsQuery.isError
      ? "목록을 불러오지 못했습니다."
      : proposalOptions && targetOptions.length === 0
        ? context.type === "ARTWORK"
          ? "등록된 공간이 없어요."
          : "등록된 작품이 없어요."
        : undefined;

  const submitError = createProposal.error
    ? createProposal.error instanceof Error
      ? createProposal.error.message
      : "전시 제안을 생성하지 못했습니다."
    : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) createProposal.reset();
    setProposeOpen(open);
  };

  const handleSubmit = async (draft: ProposeExhibitionDraft) => {
    if (!proposalOptions) return;

    if (roomId === null) return;

    const body =
      proposalOptions.contextType === "ARTWORK"
        ? {
            ...(roomId !== null && { chatRoomId: roomId }),
            artworkId: proposalOptions.fixedTarget.id,
            spaceId: draft.targetId,
            exhibitionTitle: draft.title,
            startDate: draft.startDate,
            endDate: draft.endDate,
          }
        : {
            ...(roomId !== null && { chatRoomId: roomId }),
            artworkId: draft.targetId,
            spaceId: proposalOptions.fixedTarget.id,
            exhibitionTitle: draft.title,
            startDate: draft.startDate,
            endDate: draft.endDate,
          };

    const result = await createProposal.mutateAsync(body);

    if (roomId === null) {
      router.replace(`/chat/${result.chatRoomId}`);
    }
  };

  return (
    <div className="border-b-border-primary bg-bg-primary flex w-full items-center gap-3 border-b px-4 py-3">
      {/* 썸네일 (없으면 placeholder) */}
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnailUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
      ) : (
        <div
          aria-hidden
          className="bg-bg-primary-darker text-text-disabled flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
        >
          <ImageIcon size={24} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="text-body-1 text-text-primary truncate font-semibold">
          {context.title ?? "작품/공간"}
        </div>
        <div className="text-label font-regular text-text-secondary truncate">
          {CHAT_CONTEXT_TYPE_LABEL[context.type]}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setProposeOpen(true)}
        className="bg-object-primary text-label text-text-invert hover:bg-object-primary-hover active:bg-object-primary-pressed shrink-0 rounded-lg px-4 py-2 font-semibold transition-colors"
      >
        {CHAT_PROPOSE_EXHIBITION_LABEL}
      </button>

      <ProposeExhibitionSheet
        open={proposeOpen}
        onOpenChange={handleOpenChange}
        contextType={context.type}
        targetLabel={proposalOptions?.selection.label}
        targetPlaceholder={proposalOptions?.selection.placeholder}
        targetOptions={targetOptions}
        targetMessage={targetMessage}
        isSubmitting={createProposal.isPending}
        submitError={submitError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
