import type { ConsentAgreement } from "@/types/exhibitionConsent";

interface AgreementCheckItemProps {
  agreement: ConsentAgreement;
  checked: boolean;
  readOnly?: boolean;
  onCheckedChange: (id: string, checked: boolean) => void;
}

export default function AgreementCheckItem({
  agreement,
  checked,
  readOnly = false,
  onCheckedChange,
}: AgreementCheckItemProps) {
  const inputId = `agreement-${agreement.id}`;

  return (
    <article className="flex flex-col gap-2">
      <label htmlFor={inputId} className="flex items-center gap-2">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={readOnly}
          onChange={event => onCheckedChange(agreement.id, event.target.checked)}
          className="accent-object-primary h-4 w-4 disabled:cursor-not-allowed"
        />
        <span className="text-body-1 text-text-primary font-medium">
          {agreement.title}
          {agreement.required && <span className="text-object-primary ml-0.5">(필수)</span>}
        </span>
      </label>

      <div className="bg-object-gray text-label text-text-secondary max-h-33 overflow-y-auto rounded-lg px-4 py-3 whitespace-pre-line">
        {agreement.content}
      </div>
    </article>
  );
}
