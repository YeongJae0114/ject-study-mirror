import { CalendarDays, ChevronRight, FileText, Images, MapPin } from "lucide-react";

import ExhibitionStatusBadge from "@/components/exhibition-status/ExhibitionStatusBadge";
import type { ExhibitionListItem } from "@/types/exhibition";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import HeadCountBadge from "@/components/exhibition-status/HeadCountBadge";

interface ExhibitionStatusCardProps {
  exhibition: ExhibitionListItem;
  onClick: () => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}.${month}.${day}`;
}

function formatPeriod(startDate: string, endDate: string) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export default function ExhibitionStatusCard({ exhibition, onClick }: ExhibitionStatusCardProps) {
  const thumbnailUrl = normalizeImageUrl(exhibition.thumbnailUrl);

  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-primary bg-bg-primary active:bg-bg-primary-darker flex w-full gap-4 rounded-lg border p-4 text-left transition-colors"
    >
      <div className="bg-bg-primary-darker text-text-disabled flex size-22 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {thumbnailUrl ? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${thumbnailUrl}")` }}
          />
        ) : (
          <Images size={26} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1.5 flex items-start gap-1.5">
          <ExhibitionStatusBadge status={exhibition.status} />
          {exhibition.status === "CONSENT_WRITING" && <HeadCountBadge exhibition={exhibition} />}
        </div>

        <h2 className="text-body-1 text-text-primary truncate font-semibold">{exhibition.title}</h2>

        <div className="text-label text-text-secondary mt-2 flex flex-col gap-1.5">
          <p className="flex min-w-0 items-center gap-1.5">
            <CalendarDays size={14} className="shrink-0" />
            <span className="truncate">
              {formatPeriod(exhibition.startDate, exhibition.endDate)}
            </span>
          </p>
          <p className="flex min-w-0 items-center gap-1.5">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{exhibition.spaceName}</span>
          </p>
        </div>

        {(exhibition.canWriteConsent || exhibition.canViewConsent) && (
          <div className="text-caption text-text-primary-brand mt-3 flex items-center gap-1 font-medium">
            <FileText size={14} />
            {exhibition.canWriteConsent ? "동의서 작성 필요" : "동의서 확인 가능"}
          </div>
        )}
      </div>
    </button>
  );
}
