"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AGREEMENT_CARD_ACTION_LABEL,
  AGREEMENT_CARD_DESC,
  AGREEMENT_CARD_HEADER,
} from "@/constants/chat";
import { getAgreement } from "@/services/agreementApi";

interface AgreementLinkCardProps {
  /** referenceId = agreementId. */
  agreementId: number;
}

export default function AgreementLinkCard({ agreementId }: AgreementLinkCardProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agreement", agreementId],
    queryFn: () => getAgreement(agreementId),
    enabled: Number.isFinite(agreementId),
    retry: 5,
  });

  const disabled = isLoading || isError || !data?.exhibitionId;

  const handleClick = () => {
    if (!data?.exhibitionId) return;
    router.push(`/exhibitions/${data.exhibitionId}/consent`);
  };

  return (
    <div className="border-border-primary bg-bg-primary w-full rounded-xl border p-4">
      <div className="text-label text-text-primary-brand font-semibold">
        {AGREEMENT_CARD_HEADER}
      </div>
      <div className="text-body-2 text-text-secondary mt-2">{AGREEMENT_CARD_DESC}</div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`text-body-2 mt-4 h-11 w-full rounded-lg font-semibold transition-colors ${
          disabled
            ? "bg-object-disabled text-text-disabled"
            : "bg-object-primary text-text-invert hover:bg-object-primary-hover active:bg-object-primary-pressed"
        }`}
      >
        {isLoading ? "동의서 준비 중" : AGREEMENT_CARD_ACTION_LABEL}
      </button>
      {isError && (
        <div className="text-caption text-error-default mt-2">동의서 정보를 불러오지 못했어요.</div>
      )}
    </div>
  );
}
