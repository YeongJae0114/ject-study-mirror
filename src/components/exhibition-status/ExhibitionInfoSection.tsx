import type { ReactNode } from "react";

interface ExhibitionInfoSectionProps {
  title: string;
  children: ReactNode;
}

export default function ExhibitionInfoSection({ title, children }: ExhibitionInfoSectionProps) {
  return (
    <section className="px-5 pt-10.5">
      <h2 className="text-heading-2 text-text-primary font-semibold">{title}</h2>
      <dl className="mt-3 flex flex-col gap-4">{children}</dl>
    </section>
  );
}
