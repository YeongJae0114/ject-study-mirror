import Image from "next/image";

import type { ConsentExhibitionInfo } from "@/types/exhibitionConsent";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ExhibitionProgressInfoCardProps {
  exhibition: ConsentExhibitionInfo;
}

function formatDateRange(startDate: string, endDate: string) {
  return `${startDate.replaceAll("-", ".")} - ${endDate.replaceAll("-", ".")}`;
}

function InfoAvatar({ src, alt }: { src: string | null; alt: string }) {
  const displaySrc = normalizeImageUrl(src);

  return (
    <div className="bg-object-disabled relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
      {displaySrc ? (
        <Image src={displaySrc} alt={alt} fill unoptimized className="object-cover" sizes="48px" />
      ) : null}
    </div>
  );
}

export default function ExhibitionProgressInfoCard({
  exhibition,
}: ExhibitionProgressInfoCardProps) {
  return (
    <section className="px-4 pt-5">
      <h2 className="text-headline-1 text-text-primary font-semibold">전시 진행 정보</h2>

      <div className="bg-bg-primary-darker mt-4 rounded-lg px-4 py-5">
        <dl className="flex flex-col gap-5">
          <div>
            <dt className="text-label text-text-primary font-semibold">전시명</dt>
            <dd className="text-body-2 text-text-secondary mt-1">{exhibition.title}</dd>
          </div>

          <div>
            <dt className="text-label text-text-primary font-semibold">진행 일정</dt>
            <dd className="text-body-2 text-text-secondary mt-1">
              {formatDateRange(exhibition.startDate, exhibition.endDate)}
            </dd>
          </div>

          <div>
            <dt className="text-label text-text-primary font-semibold">공간 파트너</dt>
            <dd className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <InfoAvatar
                  src={exhibition.spaceOwnerProfileImageUrl}
                  alt={`${exhibition.spaceOwnerNickname} 프로필`}
                />
                <span className="text-body-2 text-text-primary">
                  {exhibition.spaceOwnerNickname}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <InfoAvatar
                  src={exhibition.spaceThumbnailUrl}
                  alt={`${exhibition.spaceName} 이미지`}
                />
                <div>
                  <p className="text-body-2 text-text-primary">{exhibition.spaceName}</p>
                  <p className="text-caption text-text-secondary">{exhibition.spaceAddress}</p>
                </div>
              </div>
            </dd>
          </div>

          <div>
            <dt className="text-label text-text-primary font-semibold">크리에이터</dt>
            <dd className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <InfoAvatar
                  src={exhibition.creatorProfileImageUrl}
                  alt={`${exhibition.creatorNickname} 프로필`}
                />
                <span className="text-body-2 text-text-primary">{exhibition.creatorNickname}</span>
              </div>
              <div className="flex items-center gap-3">
                <InfoAvatar
                  src={exhibition.artworkThumbnailUrl}
                  alt={`${exhibition.artworkTitle} 이미지`}
                />
                <div>
                  <p className="text-body-2 text-text-primary">{exhibition.artworkTitle}</p>
                  <p className="text-caption text-text-secondary">{exhibition.artworkType}</p>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
