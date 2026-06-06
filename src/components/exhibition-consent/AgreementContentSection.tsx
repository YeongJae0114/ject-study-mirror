import AgreementCheckItem from "@/components/exhibition-consent/AgreementCheckItem";
import type { ConsentAgreement } from "@/types/exhibitionConsent";

interface AgreementContentSectionProps {
  agreements: ConsentAgreement[];
  checkedMap: Record<string, boolean>;
  readOnly?: boolean;
  onCheckedChange: (id: string, checked: boolean) => void;
}

export default function AgreementContentSection({
  agreements,
  checkedMap,
  readOnly = false,
  onCheckedChange,
}: AgreementContentSectionProps) {
  return (
    <section className="border-border-primary mt-5 border-t px-4 pt-5">
      <h2 className="text-headline-1 text-text-primary font-semibold">동의서 내용</h2>

      {agreements.length > 0 ? (
        <div className="mt-4 flex flex-col gap-5">
          {agreements.map(agreement => (
            <AgreementCheckItem
              key={agreement.id}
              agreement={agreement}
              checked={checkedMap[agreement.id] ?? agreement.checked}
              readOnly={readOnly}
              onCheckedChange={onCheckedChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-body-2 text-text-secondary mt-4">표시할 동의서 내용이 없습니다.</p>
      )}
    </section>
  );
}
