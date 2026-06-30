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
      className="bg-bg-primary active:bg-bg-primary-darker flex w-full gap-4 rounded-lg p-4 text-left transition-colors"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 전시 상태 */}
        <div className="mb-1.5 flex items-start gap-1.5">
          <ExhibitionStatusBadge status={exhibition.status} />
          {exhibition.status === "CONSENT_WRITING" && <HeadCountBadge exhibition={exhibition} />}
        </div>

        <div className="flex flex-col gap-0.5">
          {/* 전시 제목 */}
          <h2 className="text-headline-1 text-text-primary truncate font-semibold">
            {exhibition.title}
          </h2>
          <div className="text-label text-text-secondary truncate font-medium">
            {/* 전시 장소 */}
            <div>{exhibition.spaceName}</div>
            {/* 전시 날짜 */}
            <div>{formatPeriod(exhibition.startDate, exhibition.endDate)}</div>
          </div>
        </div>
      </div>
      <div className="bg-bg-primary-darker text-text-disabled flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-lg">
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
    </button>
  );
}
