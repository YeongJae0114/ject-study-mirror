import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  children: ReactNode;
}

interface ExhibitionInfoSectionProps {
  title: string;
  children: ReactNode;
}

export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3">
      <dt className="text-body-2 text-text-secondary">{label}</dt>
      <dd className="text-body-2 text-text-primary min-w-0 font-medium break-words">{children}</dd>
    </div>
  );
}

export default function ExhibitionInfoSection({ title, children }: ExhibitionInfoSectionProps) {
  return (
    <section className="border-border-primary border-b px-5 py-6">
      <h2 className="text-headline-1 text-text-primary font-semibold">{title}</h2>
      <dl className="mt-4 flex flex-col gap-3">{children}</dl>
    </section>
  );
}
