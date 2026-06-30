import { useExhibitionConsent } from "@/hooks/useExhibitionConsent";
import type { ExhibitionListItem, ExhibitionStatus } from "@/types/exhibition";
import Image from "next/image";

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  CONSENT_WRITING: "동의서 작성 중",
  SCHEDULED: "전시 예정",
  ONGOING: "전시 중",
  COMPLETED: "전시 완료",
  CANCELED: "전시 취소",
};

export function HadCountBadge(status: ExhibitionStatus) {
  return STATUS_LABEL[status];
}

export default function ExhibitionStatusBadge({ exhibition }: { exhibition: ExhibitionListItem }) {
  const { data: consentData } = useExhibitionConsent(exhibition?.id);
  const submittedCount =
    (consentData?.spaceOwnerConsentSubmitted ? 1 : 0) +
    (consentData?.creatorConsentSubmitted ? 1 : 0);
  return (
    <span className="text-caption bg-object-secondary text-text-invert inline-flex h-6 w-fit items-center rounded px-1.5 font-medium">
      <Image src="/person-icon.svg" alt="인원 수" width={16} height={16} />
      <div className="ml-0.5">{submittedCount} / 2</div>
    </span>
  );
}
