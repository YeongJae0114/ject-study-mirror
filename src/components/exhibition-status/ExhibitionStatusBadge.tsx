import type { ExhibitionStatus } from "@/types/exhibition";

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  CONSENT_WRITING: "동의서 작성 중",
  SCHEDULED: "전시 예정",
  ONGOING: "전시 중",
  COMPLETED: "전시 완료",
  CANCELED: "전시 취소",
};

const STATUS_STYLE: Record<ExhibitionStatus, string> = {
  CONSENT_WRITING: "bg-object-secondary text-text-invert",
  SCHEDULED: "bg-object-tertiary-light text-text-tertiary",
  ONGOING: "bg-object-primary-light text-text-primary-brand",
  COMPLETED: "bg-object-secondary-light text-text-primary",
  CANCELED: "bg-object-secondary-light text-text-secondary",
};

export function getExhibitionStatusLabel(status: ExhibitionStatus) {
  return STATUS_LABEL[status];
}

export default function ExhibitionStatusBadge({ status }: { status: ExhibitionStatus }) {
  return (
    <span
      className={`text-caption inline-flex h-6 w-fit items-center rounded px-1.5 font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
