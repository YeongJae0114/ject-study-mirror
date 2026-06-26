import Link from "next/link";

import type { ExhibitionStatusFilterParam } from "@/types/exhibition";

interface StatusFilterTab {
  param: ExhibitionStatusFilterParam;
  label: string;
}

const TABS: StatusFilterTab[] = [
  { param: "consent-writing", label: "동의서 작성 중" },
  { param: "confirmed", label: "전시 확정" },
  { param: "canceled", label: "전시 취소" },
];

interface StatusFilterTabsProps {
  activeFilter?: ExhibitionStatusFilterParam;
}

export default function StatusFilterTabs({ activeFilter }: StatusFilterTabsProps) {
  return (
    <div className="border-border-primary bg-bg-primary sticky top-0 z-10 border-b px-5 pb-3">
      <div className="flex items-center gap-2">
        {TABS.map(tab => {
          const active = tab.param === activeFilter;

          return (
            <Link
              key={tab.param}
              href={active ? "/exhibitions/status" : `/exhibitions/status?filter=${tab.param}`}
              aria-current={active ? "page" : undefined}
              className={`text-label flex h-8 items-center justify-center rounded-full border px-3 font-medium transition-colors ${
                active
                  ? "bg-object-primary-light border-border-secondary-light text-text-primary-brand"
                  : "bg-object-white border-border-primary text-text-secondary"
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
