import Link from "next/link";

import type { ExhibitionStatusFilterParam } from "@/types/exhibition";

interface StatusFilterTab {
  param: ExhibitionStatusFilterParam;
  label: string;
}

const TABS: StatusFilterTab[] = [
  { param: "consent-writing", label: "동의서 작성중" },
  { param: "confirmed", label: "진행 확정" },
  { param: "canceled", label: "취소" },
];

interface StatusFilterTabsProps {
  activeFilter: ExhibitionStatusFilterParam;
}

export default function StatusFilterTabs({ activeFilter }: StatusFilterTabsProps) {
  return (
    <div className="border-border-primary bg-bg-primary sticky top-15 z-10 border-b px-5">
      <div className="flex h-13 items-center gap-2">
        {TABS.map(tab => {
          const active = tab.param === activeFilter;

          return (
            <Link
              key={tab.param}
              href={`/exhibitions/status?filter=${tab.param}`}
              aria-current={active ? "page" : undefined}
              className={`text-label flex h-8 items-center justify-center rounded-full px-3 font-medium transition-colors ${
                active
                  ? "bg-object-primary text-text-invert"
                  : "bg-bg-primary-darker text-text-secondary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
