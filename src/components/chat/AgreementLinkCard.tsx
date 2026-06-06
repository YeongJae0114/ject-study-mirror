"use client";

import {
  AGREEMENT_CARD_ACTION_LABEL,
  AGREEMENT_CARD_DESC,
  AGREEMENT_CARD_HEADER,
} from "@/constants/chat";

interface AgreementLinkCardProps {
  /** referenceId = agreementId. 합의서 상세/작성 API가 없어 현재는 표시만. */
  agreementId: number;
}

export default function AgreementLinkCard({ agreementId }: AgreementLinkCardProps) {
  // TODO: 합의서 상세/작성 API 연동 후 전시 현황 동의서로 이동 (현재 상세 API 없음)
  void agreementId;

  return (
    <div className="border-border-primary bg-bg-primary w-full rounded-xl border p-4">
      <div className="text-label text-text-primary-brand font-semibold">
        {AGREEMENT_CARD_HEADER}
      </div>
      <div className="text-body-2 text-text-secondary mt-2">{AGREEMENT_CARD_DESC}</div>
      <button
        type="button"
        disabled
        className="bg-object-disabled text-body-2 text-text-disabled mt-4 h-11 w-full rounded-lg font-semibold"
      >
        {AGREEMENT_CARD_ACTION_LABEL}
      </button>
    </div>
  );
}
