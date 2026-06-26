import { ExhibitionConsent } from "@/types/exhibitionConsent";

const CONSENT_STATUS_LABEL = {
  COMPLETE: "동의서 작성 완료",
  INCOMPLETE: "동의서 작성 미완료",
};

const CONSENT_STATUS_STYLE = {
  COMPLETE: "bg-object-primary-light text-text-primary-brand",
  INCOMPLETE: "bg-object-secondary-light text-text-primary",
};

export default function ConsentStatusBadge({ consent }: { consent: ExhibitionConsent }) {
  const isCompleted = consent.creatorConsentSubmitted && consent.spaceOwnerConsentSubmitted;

  return (
    <span
      className={`text-caption inline-flex h-5 w-fit items-center rounded px-1.5 font-medium ${
        isCompleted ? CONSENT_STATUS_STYLE.COMPLETE : CONSENT_STATUS_STYLE.INCOMPLETE
      }`}
    >
      {isCompleted ? CONSENT_STATUS_LABEL.COMPLETE : CONSENT_STATUS_LABEL.INCOMPLETE}
    </span>
  );
}
