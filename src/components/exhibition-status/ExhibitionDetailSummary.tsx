import { CalendarDays, Images, MapPin } from "lucide-react";

import ExhibitionStatusBadge from "@/components/exhibition-status/ExhibitionStatusBadge";
import type { ExhibitionDetail, ExhibitionStatus } from "@/types/exhibition";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ExhibitionDetailSummaryProps {
  exhibition: ExhibitionDetail;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}.${month}.${day}`;
}
const STATUS_INFO: Record<ExhibitionStatus, { label: string; color: string }> = {
  CONSENT_WRITING: {
    label: "동의서 작성 중",
    color: "text-text-secondary",
  },
  SCHEDULED: {
    label: "전시 예정",
    color: "text-text-tertiary",
  },
  ONGOING: {
    label: "전시 중",
    color: "text-text-primary-brand",
  },
  COMPLETED: {
    label: "전시 완료",
    color: "text-text-secondary",
  },
  CANCELED: {
    label: "전시 취소",
    color: "text-text-secondary",
  },
};

export default function ExhibitionDetailSummary({ exhibition }: ExhibitionDetailSummaryProps) {
  return (
    <section className="px-5">
      <div className="mt-6">
        <div className="flex flex-col gap-1">
          <p className={`text-headline-1 font-semibold ${STATUS_INFO[exhibition.status].color}`}>
            {STATUS_INFO[exhibition.status].label}
          </p>
          <h1 className="text-title-3 text-text-primary font-semibold">{exhibition.title}</h1>
          <div className="text-headline-1 font-regular text-text-secondary flex flex-col gap-2">
            <div>
              {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
