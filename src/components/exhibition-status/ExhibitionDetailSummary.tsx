import { CalendarDays, Images, MapPin } from "lucide-react";

import ExhibitionStatusBadge from "@/components/exhibition-status/ExhibitionStatusBadge";
import type { ExhibitionDetail } from "@/types/exhibition";

interface ExhibitionDetailSummaryProps {
  exhibition: ExhibitionDetail;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}.${month}.${day}`;
}

export default function ExhibitionDetailSummary({ exhibition }: ExhibitionDetailSummaryProps) {
  return (
    <section className="border-border-primary border-b px-5 py-5">
      <div className="bg-bg-primary-darker text-text-disabled flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-lg">
        {exhibition.artwork.thumbnailUrl ? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${exhibition.artwork.thumbnailUrl})` }}
          />
        ) : (
          <Images size={34} />
        )}
      </div>

      <div className="mt-5">
        <ExhibitionStatusBadge status={exhibition.status} />
        <h1 className="text-heading-1 text-text-primary mt-2 font-semibold">{exhibition.title}</h1>

        <div className="text-body-2 text-text-secondary mt-4 flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0" />
            <span>
              {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
            </span>
          </p>
          <p className="flex min-w-0 items-center gap-2">
            <MapPin size={16} className="shrink-0" />
            <span className="truncate">{exhibition.space.name}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
